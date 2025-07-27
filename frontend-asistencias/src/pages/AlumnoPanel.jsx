import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AlumnoPanel() {
  const [asistencias, setAsistencias] = useState([]);
  const [porcentaje, setPorcentaje] = useState(0);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await api.get('/asistencia/historial');
        setAsistencias(res.data);

        const total = res.data.length;
        const presentes = res.data.filter((a) => a.estado === 'presente').length;
        if (total > 0) setPorcentaje(((presentes / total) * 100).toFixed(1));
      } catch (err) {
        alert('Error al cargar historial');
      }
    };
    fetchHistorial();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👨‍🎓 Historial de Asistencias</h2>
      <p className="mb-2">📊 Porcentaje de asistencia: <span className="font-semibold">{porcentaje}%</span></p>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Grado</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a) => (
            <tr key={a.id}>
              <td className="p-2 border">{new Date(a.fecha).toLocaleDateString()}</td>
              <td className="p-2 border">{a.grado_nombre}</td>
              <td className={`p-2 border ${a.estado === 'ausente' ? 'text-red-500' : a.estado === 'justificado' ? 'text-yellow-600' : 'text-green-600'}`}>
                {a.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
