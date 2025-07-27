const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

// Obtener grados asignados al docente que está logueado
router.get('/grados', verificarToken, soloRol('docente'), async (req, res) => {
  try {
    const docenteId = req.usuario.id; // obtenemos el id del docente del token
    const result = await pool.query(`
      SELECT g.id, g.nombre 
      FROM grados g
      JOIN docentes_grados dg ON dg.grado_id = g.id
      WHERE dg.docente_id = $1
    `, [docenteId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener grados del docente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
