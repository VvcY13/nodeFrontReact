// src/components/Layout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/"; // Redirigir al login
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="nav-link" to="/home">
            Higiene y Cuidado
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/userManagement">
                  <strong>Gestionar Usuarios</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/insumosManagement">
                  <strong>Gestionar Insumos</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/almacenesManagement">
                  <strong>Gestionar Almacenes</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/produccionManagement">
                  <strong>Gestionar Produccion</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/stockGeneralManagement">
                  <strong>Gestionar Stock Terminado</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/almacenManagement">
                  <strong>Almacen Principal</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/turnosManagement">
                  <strong>Inicios Y Finales</strong>
                </Link>
              </li>
              
            </ul>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Aquí se renderiza el contenido de cada página */}
      <div className="container mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;