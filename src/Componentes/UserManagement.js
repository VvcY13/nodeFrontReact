import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        nombres: '',
        apellidos: '',
        tipoDocumento: '',
        numeroDocumento: '',
        email: '',
        password: '',
        estado: true,
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setError('Error al obtener usuarios.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/users/${formData.id}`, formData);
                setSuccess('Usuario actualizado exitosamente!');
            } else {
                await axios.post('http://localhost:3001/api/auth/register', formData);
                setSuccess('Usuario creado exitosamente!');
            }
            setError('');
            fetchUsers(); // Actualizar la lista de usuarios
            handleClose();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            setError('Error al guardar usuario.');
            setSuccess('');
        }
    };

    const handleEdit = (user) => {
        setFormData(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:3001/api/users/${id}`);
                setSuccess('Usuario eliminado exitosamente!');
                fetchUsers(); // Actualizar la lista de usuarios
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                setError('Error al eliminar usuario.');
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            id: '',
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            numeroDocumento: '',
            email: '',
            password: '',
            estado: true,
        });
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <h2>Gestión de Usuarios</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Usuario
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Tipo de Documento</th>
                        <th>Número de Documento</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nombres}</td>
                            <td>{user.apellidos}</td>
                            <td>{user.tipoDocumento}</td>
                            <td>{user.numeroDocumento}</td>
                            <td>{user.email}</td>
                            <td>{user.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(user)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombres">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa los nombres" 
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formApellidos">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa los apellidos" 
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formTipoDocumento">
                            <Form.Label>Tipo de Documento</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa el tipo de documento" 
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumeroDocumento">
                            <Form.Label>Número de Documento</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa el número de documento" 
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Ingresa el email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Ingresa la contraseña" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formEstado">
                            <Form.Check 
                                type="checkbox"
                                label="Activo"
                                name="estado"
                                checked={formData.estado}
                                onChange={() => setFormData({ ...formData, estado: !formData.estado })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Actualizar Usuario' : 'Agregar Usuario'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserManagement;