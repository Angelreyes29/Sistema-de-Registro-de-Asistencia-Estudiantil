-- Tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  rol VARCHAR(10) CHECK (rol IN ('admin', 'docente', 'alumno'))
);

-- Tabla grados
CREATE TABLE grados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Tabla alumnos_grados
CREATE TABLE alumnos_grados (
  alumno_id INT REFERENCES usuarios(id),
  grado_id INT REFERENCES grados(id),
  PRIMARY KEY (alumno_id, grado_id)
);

-- Tabla docentes_grados
CREATE TABLE docentes_grados (
  docente_id INT REFERENCES usuarios(id),
  grado_id INT REFERENCES grados(id),
  PRIMARY KEY (docente_id, grado_id)
);

-- Tabla asistencias
CREATE TABLE asistencias (
  id SERIAL PRIMARY KEY,
  alumno_id INT REFERENCES usuarios(id),
  grado_id INT REFERENCES grados(id),
  fecha DATE NOT NULL,
  estado VARCHAR(20) CHECK (estado IN ('presente', 'ausente', 'justificado'))
);
