import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [grados, setGrados] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "alumno",
    grado_id: "",
  });

  const cargar = async () => {
    const u = await api.get("/admin/usuarios");
    const g = await api.get("/admin/grados");
    setUsuarios(u.data);
    setGrados(g.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const crearUsuario = async () => {
    await api.post("/admin/usuarios", nuevo);
    setNuevo({ nombre: "", correo: "", password: "", rol: "alumno", grado_id: "" });
    cargar();
  };

  const eliminarUsuario = async (id) => {
    await api.delete(`/admin/usuarios/${id}`);
    cargar();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">👥 Gestión de Usuarios</h3>

      <div className="grid grid-cols-2 gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Correo"
          value={nuevo.correo}
          onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Contraseña"
          type="password"
          value={nuevo.password}
          onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={nuevo.rol}
          onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
        >
          <option value="alumno">Alumno</option>
          <option value="docente">Docente</option>
        </select>
        {nuevo.rol !== "admin" && (
          <select
            className="border p-2 rounded col-span-2"
            value={nuevo.grado_id}
            onChange={(e) => setNuevo({ ...nuevo, grado_id: e.target.value })}
          >
            <option value="">Seleccionar Grado</option>
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={crearUsuario}
          className="bg-blue-600 text-white py-2 px-4 rounded col-span-2"
        >
          Crear Usuario
        </button>
      </div>

      <ul className="list-disc pl-6">
        {usuarios.map((u) => (
          <li key={u.id} className="flex justify-between items-center">
            {u.nombre} ({u.rol})
            <button
              className="text-red-600 hover:underline"
              onClick={() => eliminarUsuario(u.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
