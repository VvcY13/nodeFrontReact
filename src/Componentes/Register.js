import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('DNI'); // Tipo de documento predeterminado
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [estado, setEstado] = useState(true); // Estado predeterminado a true
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
            });
            return;
        }

        const userData = {
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            tipoDocumento,
            numeroDocumento: numeroDocumento.trim(),
            email: email.trim().toLowerCase(),
            password,
            estado,
        };

        fetch("http://localhost:3001/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al registrar el usuario');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Usuario registrado:", data);
                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso',
                    text: 'Usuario registrado con éxito',
                }).then(() => {
                    navigate("/"); // Redirigir tras el registro
                });
            })
            .catch((error) => {
                console.error("Error al registrar el usuario:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al registrar el usuario',
                });
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleRegister} className="border p-4 rounded shadow">
                        <div className="mb-3">
                            <label className="form-label">Nombres:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellidos:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo de Documento:</label>
                            <select
                                className="form-select"
                                value={tipoDocumento}
                                onChange={(e) => setTipoDocumento(e.target.value)}
                            >
                                <option value="DNI">DNI</option>
                                <option value="Pasaporte">Pasaporte</option>
                                {/* Puedes agregar más opciones según sea necesario */}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Número de Documento:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={numeroDocumento}
                                onChange={(e) => setNumeroDocumento(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmar Contraseña:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
