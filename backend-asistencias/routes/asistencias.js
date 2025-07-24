const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

// Obtener alumnos del grado (solo docentes)
router.get('/grado/:id', verificarToken, soloRol('docente'), async (req, res) => {
  const gradoId = req.params.id;
  try {
    // Verifica que el docente tenga asignado ese grado
    const valid = await pool.query(
      'SELECT * FROM docentes_grados WHERE docente_id = $1 AND grado_id = $2',
      [req.usuario.id, gradoId]
    );
    if (valid.rowCount === 0) return res.status(403).json({ error: 'No autorizado para este grado' });

    const alumnos = await pool.query(
      `SELECT u.id, u.nombre
       FROM alumnos_grados ag
       JOIN usuarios u ON ag.alumno_id = u.id
       WHERE ag.grado_id = $1`, [gradoId]
    );
    res.json(alumnos.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alumnos del grado' });
  }
});

// Registrar asistencia (solo docente)
router.post('/', verificarToken, soloRol('docente'), async (req, res) => {
  const { grado_id, fecha, asistencias } = req.body;
  try {
    const insertPromises = asistencias.map(a =>
      pool.query(
        'INSERT INTO asistencias (alumno_id, grado_id, fecha, estado) VALUES ($1, $2, $3, $4)',
        [a.alumno_id, grado_id, fecha, a.estado]
      )
    );
    await Promise.all(insertPromises);
    res.json({ message: 'Asistencia registrada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// Editar asistencia del día
router.put('/:id', verificarToken, soloRol('docente'), async (req, res) => {
  const asistenciaId = req.params.id;
  const { estado } = req.body;
  try {
    await pool.query('UPDATE asistencias SET estado = $1 WHERE id = $2', [estado, asistenciaId]);
    res.json({ message: 'Asistencia actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar asistencia' });
  }
});
// Obtener historial personal (solo alumno)
router.get('/historial', verificarToken, soloRol('alumno'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT fecha, estado, grado_id FROM asistencias WHERE alumno_id = $1 ORDER BY fecha DESC',
      [req.usuario.id]
    );
    // Porcentaje
    const total = result.rowCount;
    const presentes = result.rows.filter(r => r.estado === 'presente').length;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

    res.json({
      historial: result.rows,
      porcentaje_asistencia: porcentaje
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});
// Reporte por grado
router.get('/reporte/grado/:id', verificarToken, soloRol('admin'), async (req, res) => {
  const gradoId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT u.nombre, COUNT(a.id) AS total, 
        SUM(CASE WHEN a.estado = 'presente' THEN 1 ELSE 0 END) AS presentes
       FROM asistencias a
       JOIN usuarios u ON a.alumno_id = u.id
       WHERE a.grado_id = $1
       GROUP BY u.id`,
      [gradoId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte por grado' });
  }
});

// Reporte por alumno
router.get('/reporte/alumno/:id', verificarToken, soloRol('admin'), async (req, res) => {
  const alumnoId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT fecha, estado FROM asistencias
       WHERE alumno_id = $1 ORDER BY fecha DESC`,
      [alumnoId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte del alumno' });
  }
});



module.exports = router;
