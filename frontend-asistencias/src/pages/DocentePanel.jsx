import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DocentePanel() {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState({}); // {alumno_id: 'presente'|'ausente'|'justificado'}

  useEffect(() => {
    const cargarGrados = async () => {
      try {
        const res = await api.get('/docente/grados');
        setGrados(res.data);
      } catch {
        alert('Error al cargar grados');
      }
    };
    cargarGrados();
  }, []);

  const seleccionarGrado = async (grado) => {
    setGradoSeleccionado(grado);
    try {
      const res = await api.get(`/asistencia/grado/${grado.id}`);
      setAlumnos(res.data);
      setAsistencias({});
    } catch {
      alert('Error al cargar alumnos');
    }
  };

  const marcarAsistencia = (alumnoId, estado) => {
    setAsistencias((prev) => ({
      ...prev,
      [alumnoId]: estado,
    }));
  };

  const enviarAsistencia = async () => {
    const lista = Object.entries(asistencias).map(([alumno_id, estado]) => ({
      alumno_id,
      grado_id: gradoSeleccionado.id,
      estado,
      fecha: new Date().toISOString().split('T')[0],
    }));

    try {
      await api.post('/asistencia', { asistencias: lista });
      alert('Asistencia registrada correctamente');
    } catch {
      alert('Error al registrar asistencia');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📘 Panel del Docente</h2>

      <div className="mb-4">
        <label className="block font-medium">Selecciona un grado:</label>
        <select
          className="mt-1 border p-2 rounded"
          onChange={(e) =>
            seleccionarGrado(grados.find((g) => g.id === parseInt(e.target.value)))
          }
        >
          <option>-- Selecciona --</option>
          {grados.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>

      {gradoSeleccionado && (
        <>
          <h3 className="text-xl font-semibold mb-2">📋 Lista de Alumnos</h3>
          <table className="w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td className="p-2 border">{alumno.nombre}</td>
                  <td className="p-2 border">
                    <select
                      value={asistencias[alumno.id] || ''}
                      onChange={(e) => marcarAsistencia(alumno.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="">--</option>
                      <option value="presente">Presente</option>
                      <option value="ausente">Ausente</option>
                      <option value="justificado">Justificado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={enviarAsistencia}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Guardar Asistencia
          </button>
        </>
      )}
    </div>
  );
}
