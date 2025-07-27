import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Reportes() {
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [reporte, setReporte] = useState([]);
  const [gradoId, setGradoId] = useState("");
  const [alumnoId, setAlumnoId] = useState("");

  const cargarGrados = async () => {
    const res = await api.get("/admin/grados");
    setGrados(res.data);
  };

  const cargarAlumnos = async () => {
    const res = await api.get("/admin/usuarios");
    setAlumnos(res.data.filter((u) => u.rol === "alumno"));
  };

  useEffect(() => {
    cargarGrados();
    cargarAlumnos();
  }, []);

  const obtenerPorGrado = async () => {
    const res = await api.get(`/admin/reportes/grado/${gradoId}`);
    setReporte(res.data);
  };

  const obtenerPorAlumno = async () => {
    const res = await api.get(`/admin/reportes/alumno/${alumnoId}`);
    setReporte([res.data]); // Convertimos a array para mostrar igual que por grado
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📈 Reportes de Asistencia</h3>

      <div className="grid grid-cols-2 gap-2">
        <select
          className="border p-2 rounded"
          onChange={(e) => setGradoId(e.target.value)}
        >
          <option value="">Selecciona un grado</option>
          {grados.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white rounded p-2"
          onClick={obtenerPorGrado}
        >
          Ver por Grado
        </button>

        <select
          className="border p-2 rounded"
          onChange={(e) => setAlumnoId(e.target.value)}
        >
          <option value="">Selecciona un alumno</option>
          {alumnos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
        <button
          className="bg-green-600 text-white rounded p-2"
          onClick={obtenerPorAlumno}
        >
          Ver por Alumno
        </button>
      </div>

      <table className="w-full table-auto border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Alumno</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Presentes</th>
            <th className="border px-2 py-1">Ausentes</th>
            <th className="border px-2 py-1">Justificados</th>
            <th className="border px-2 py-1">Asistencia %</th>
          </tr>
        </thead>
        <tbody>
          {reporte.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-1">{r.nombre}</td>
              <td className="border px-2 py-1">{r.total}</td>
              <td className="border px-2 py-1">{r.presentes}</td>
              <td className="border px-2 py-1">{r.ausentes}</td>
              <td className="border px-2 py-1">{r.justificados}</td>
              <td className="border px-2 py-1">
                {((r.presentes / r.total) * 100 || 0).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
