const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, rol]
    );
    res.json({ message: 'Usuario registrado', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const usuario = result.rows[0];
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
