import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import GradosCrud from "../components/admin/GradosCrud";
import UsuariosCrud from "../components/admin/UsuariosCrud";
import Reportes from "../components/admin/Reportes";

export default function AdminPanel() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">⚙️ Panel del Administrador</h2>

      <Tabs defaultValue="grados" className="w-full">
        <TabsList>
          <TabsTrigger value="grados">Grados</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="grados">
          <GradosCrud />
        </TabsContent>
        <TabsContent value="usuarios">
          <UsuariosCrud />
        </TabsContent>
        <TabsContent value="reportes">
          <Reportes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
