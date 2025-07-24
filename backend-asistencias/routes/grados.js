const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

// Crear grado
router.post('/', verificarToken, soloRol('admin'), async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query('INSERT INTO grados (nombre) VALUES ($1) RETURNING *', [nombre]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear grado' });
  }
});

// Obtener todos los grados
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grados');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener grados' });
  }
});

// Asignar alumno a grado
router.post('/asignar-alumno', verificarToken, soloRol('admin'), async (req, res) => {
  const { alumno_id, grado_id } = req.body;
  try {
    await pool.query('INSERT INTO alumnos_grados (alumno_id, grado_id) VALUES ($1, $2)', [alumno_id, grado_id]);
    res.json({ message: 'Alumno asignado al grado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar alumno' });
  }
});

// Asignar docente a grado
router.post('/asignar-docente', verificarToken, soloRol('admin'), async (req, res) => {
  const { docente_id, grado_id } = req.body;
  try {
    await pool.query('INSERT INTO docentes_grados (docente_id, grado_id) VALUES ($1, $2)', [docente_id, grado_id]);
    res.json({ message: 'Docente asignado al grado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar docente' });
  }
});

module.exports = router;
