const express = require('express');
const router = express.Router();
const { verificarToken, soloRol } = require('../middleware/auth');
const pool = require('../db');
// Obtener reporte por grado
router.get('/grado/:id', verificarToken, soloRol('admin'), async (req, res) => {
  const gradoId = req.params.id;
  try {
    const result = await pool.query(`
      SELECT a.fecha, u.nombre, g.nombre AS grado, a.estado
      FROM asistencias a
      JOIN usuarios u ON a.alumno_id = u.id
      JOIN grados g ON a.grado_id = g.id
      WHERE a.grado_id = $1
      ORDER BY a.fecha DESC
    `, [gradoId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reporte por grado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener reporte por alumno
router.get('/alumno/:id', verificarToken, soloRol('admin'), async (req, res) => {
  const alumnoId = req.params.id;
  try {
    const result = await pool.query(`
      SELECT a.fecha, g.nombre AS grado, a.estado
      FROM asistencias a
      JOIN grados g ON a.grado_id = g.id
      WHERE a.alumno_id = $1
      ORDER BY a.fecha DESC
    `, [alumnoId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reporte por alumno:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


module.exports = router;

