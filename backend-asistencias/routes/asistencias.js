const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');
// Obtener alumnos del grado (solo docentes)
router.get('/grado/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'docente') return res.sendStatus(403);
  const gradoId = req.params.id;

  const result = await pool.query(`
    SELECT u.id, u.nombre
    FROM alumnos_grados ag
    JOIN usuarios u ON ag.alumno_id = u.id
    WHERE ag.grado_id = $1
  `, [gradoId]);

  res.json(result.rows);
});

// Registrar asistencia (solo docentes)
router.put('/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'docente') return res.sendStatus(403);

  for (let a of lista) {
    await pool.query(
      `INSERT INTO asistencias (alumno_id, grado_id, fecha, estado)
       VALUES ($1, $2, $3, $4)`,
      [a.alumno_id, a.grado_id, a.fecha, a.estado]
    );
  }

  res.json({ mensaje: 'Asistencias registradas' });
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
router.get('/historial', verificarToken, async (req, res) => {
  const { id, rol } = req.usuario;
  if (rol !== 'alumno') return res.status(403).json({ error: 'Solo alumnos' });

  const result = await pool.query(`
    SELECT a.id, a.fecha, a.estado, g.nombre AS grado_nombre
    FROM asistencias a
    JOIN grados g ON a.grado_id = g.id
    WHERE a.alumno_id = $1
    ORDER BY a.fecha DESC
  `, [id]);

  res.json(result.rows);
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
