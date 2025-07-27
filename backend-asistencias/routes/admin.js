// Obtener grados
router.get('/grados', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const grados = await pool.query('SELECT * FROM grados');
  res.json(grados.rows);
});

// Crear grado
router.post('/grados', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const { nombre } = req.body;
  await pool.query('INSERT INTO grados (nombre) VALUES ($1)', [nombre]);
  res.sendStatus(201);
});

// Eliminar grado
router.delete('/grados/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  await pool.query('DELETE FROM grados WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});
// Ver todos los usuarios
router.get('/usuarios', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const usuarios = await pool.query('SELECT * FROM usuarios');
  res.json(usuarios.rows);
});

// Crear usuario
router.post('/usuarios', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const { nombre, correo, password, rol, grado_id } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const nuevo = await pool.query(
    'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1,$2,$3,$4) RETURNING id',
    [nombre, correo, hashed, rol]
  );
  const nuevoId = nuevo.rows[0].id;

  if (rol === 'alumno') {
    await pool.query('INSERT INTO alumnos_grados (alumno_id, grado_id) VALUES ($1, $2)', [
      nuevoId,
      grado_id,
    ]);
  } else if (rol === 'docente') {
    await pool.query('INSERT INTO docentes_grados (docente_id, grado_id) VALUES ($1, $2)', [
      nuevoId,
      grado_id,
    ]);
  }

  res.sendStatus(201);
});

// Eliminar usuario
router.delete('/usuarios/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});
// Reporte por grado
router.get('/reportes/grado/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const grado_id = req.params.id;

  const alumnos = await pool.query(`
    SELECT u.id, u.nombre FROM usuarios u
    INNER JOIN alumnos_grados ag ON ag.alumno_id = u.id
    WHERE ag.grado_id = $1
  `, [grado_id]);

  const resultados = [];

  for (const alumno of alumnos.rows) {
    const conteo = await pool.query(`
      SELECT estado, COUNT(*) FROM asistencias
      WHERE alumno_id = $1 AND grado_id = $2
      GROUP BY estado
    `, [alumno.id, grado_id]);

    const total = conteo.rows.reduce((s, row) => s + Number(row.count), 0);
    const presentes = conteo.rows.find(r => r.estado === 'presente')?.count || 0;
    const ausentes = conteo.rows.find(r => r.estado === 'ausente')?.count || 0;
    const justificados = conteo.rows.find(r => r.estado === 'justificado')?.count || 0;

    resultados.push({
      nombre: alumno.nombre,
      total,
      presentes,
      ausentes,
      justificados
    });
  }

  res.json(resultados);
});
// Asignar docente a grado
router.post('/docentes/asignar', verificarToken, soloRol('admin'), async (req, res) => {
  const { docente_id, grado_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO docentes_grados (docente_id, grado_id) VALUES ($1, $2)',
      [docente_id, grado_id]
    );
    res.status(201).json({ message: 'Docente asignado correctamente al grado.' });
  } catch (error) {
    console.error('Error al asignar docente a grado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// Reporte por alumno
router.get('/reportes/alumno/:id', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') return res.sendStatus(403);
  const alumno_id = req.params.id;

  const nombre = await pool.query(`SELECT nombre FROM usuarios WHERE id = $1`, [alumno_id]);

  const conteo = await pool.query(`
    SELECT estado, COUNT(*) FROM asistencias
    WHERE alumno_id = $1
    GROUP BY estado
  `, [alumno_id]);

  const total = conteo.rows.reduce((s, row) => s + Number(row.count), 0);
  const presentes = conteo.rows.find(r => r.estado === 'presente')?.count || 0;
  const ausentes = conteo.rows.find(r => r.estado === 'ausente')?.count || 0;
  const justificados = conteo.rows.find(r => r.estado === 'justificado')?.count || 0;

  res.json({
    nombre: nombre.rows[0].nombre,
    total,
    presentes,
    ausentes,
    justificados
  });
});


