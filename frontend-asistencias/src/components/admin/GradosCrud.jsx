import { useEffect, useState } from "react";
import api from "../../services/api";

export default function GradosCrud() {
  const [grados, setGrados] = useState([]);
  const [nuevo, setNuevo] = useState("");

  const cargar = async () => {
    const res = await api.get("/admin/grados");
    setGrados(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const agregar = async () => {
    await api.post("/admin/grados", { nombre: nuevo });
    setNuevo("");
    cargar();
  };

  const eliminar = async (id) => {
    await api.delete(`/admin/grados/${id}`);
    cargar();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📘 Grados</h3>

      <div className="flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Nuevo grado"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
        />
        <button
          onClick={agregar}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Agregar
        </button>
      </div>

      <ul className="list-disc pl-6">
        {grados.map((g) => (
          <li key={g.id} className="flex justify-between items-center">
            {g.nombre}
            <button
              className="text-red-600 hover:underline"
              onClick={() => eliminar(g.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
