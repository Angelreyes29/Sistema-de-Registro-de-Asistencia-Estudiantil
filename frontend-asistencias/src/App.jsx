import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AlumnoPanel from './pages/AlumnoPanel';
import DocentePanel from './pages/DocentePanel';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/alumno' element={<AlumnoPanel />} />
        <Route path='/docente' element={<DocentePanel />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
