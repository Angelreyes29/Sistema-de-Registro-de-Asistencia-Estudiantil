const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
router.get('/', verificarToken, soloRol('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo, rol FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear nuevo usuario (admin)
router.post('/', verificarToken, soloRol('admin'), async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol',
      [nombre, correo, hashedPassword, rol]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', verificarToken, soloRol('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
