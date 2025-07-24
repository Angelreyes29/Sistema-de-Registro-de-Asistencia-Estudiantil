const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const gradoRoutes = require('./routes/grados');
const asistenciaRoutes = require('./routes/asistencias');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/asistencia', asistenciaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
