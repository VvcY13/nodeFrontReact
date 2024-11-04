import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import Login from './Componentes/Login';
import Register from './Componentes/Register';
import Home from './Componentes/Home';
import Layout from './Componentes/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import InsumoManagement from './Componentes/InsumosManagement';
import InventarioAlmacenManagement from './Componentes/InventarioAlmacenManagement';
import ProduccionManagement from './Componentes/ProduccionManagement';
import StockGeneralManagement from './Componentes/StockGeneralManagement';
import UserManagement from './Componentes/UserManagement';
import AlmacenManagement from './Componentes/AlmacenManagement';
import IniciosFinalesManagement from './Componentes/IniciosFinales';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/insumosManagement" element={<InsumoManagement />} />
          <Route path="/almacenesManagement" element={<InventarioAlmacenManagement />} />
          <Route path="/produccionManagement" element={<ProduccionManagement />} />
          <Route path="/stockGeneralManagement" element={<StockGeneralManagement/>}/>
          <Route path="/userManagement" element={<UserManagement/>}/>
          <Route path="/almacenManagement" element={<AlmacenManagement />} />
          <Route path="/turnosManagement" element={<IniciosFinalesManagement />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
