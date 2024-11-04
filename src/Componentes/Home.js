// src/pages/Home.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Si no hay token, redirige al login
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div>
      <div className="container mt-5">
        <h1>Bienvenido a la Página de Inicio</h1>
        <p>Aquí puedes poner el contenido principal de tu aplicación.</p>
      </div>
    </div>
  );
}

export default Home;
