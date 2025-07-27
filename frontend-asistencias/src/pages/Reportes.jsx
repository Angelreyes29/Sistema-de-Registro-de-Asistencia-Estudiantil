import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reportes = () => {
  const [reporteGrado, setReporteGrado] = useState([]);
  const [reporteAlumno, setReporteAlumno] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cambia estos IDs según pruebas
  const gradoId = 1;
  const alumnoId = 1;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Asegúrate de tener el token guardado

    const fetchReporteGrado = axios.get(`http://localhost:3001/api/admin/reportes/grado/${gradoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const fetchReporteAlumno = axios.get(`http://localhost:3001/api/admin/reportes/alumno/${alumnoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Promise.all([fetchReporteGrado, fetchReporteAlumno])
      .then(([resGrado, resAlumno]) => {
        setReporteGrado(resGrado.data);
        setReporteAlumno(resAlumno.data);
      })
      .catch((err) => {
        console.error('Error cargando reportes:', err);
        setError('Error al obtener los reportes.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando reportes...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Reporte por Grado (ID: {gradoId})</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Grado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reporteGrado.map((r, i) => (
              <tr key={i}>
                <td>{r.fecha}</td>
                <td>{r.nombre}</td>
                <td>{r.apellido}</td>
                <td>{r.grado}</td>
                <td>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-5 mb-4">Reporte por Alumno (ID: {alumnoId})</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Grado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reporteAlumno.map((r, i) => (
              <tr key={i}>
                <td>{r.fecha}</td>
                <td>{r.grado}</td>
                <td>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
