// src/componentes/AlmacenesManagement.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const InventarioAlmacenManagement = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        descripcion: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAlmacenes();
    }, []);

    const fetchAlmacenes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/almacenes');
            setAlmacenes(response.data);
        } catch (error) {
            Swal.fire('Error', 'Error al obtener almacenes.', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/almacenes/${formData.id}`, formData);
                Swal.fire('Actualizado', 'Almacén actualizado exitosamente!', 'success');
            } else {
                await axios.post('http://localhost:3001/api/almacenes', formData);
                Swal.fire('Creado', 'Almacén creado exitosamente!', 'success');
            }
            handleClose();
            fetchAlmacenes(); // Refresca la lista de almacenes
        } catch (error) {
            Swal.fire('Error', 'Error al guardar almacén.', 'error');
        }
    };

    const handleEdit = (almacen) => {
        setFormData(almacen);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/api/almacenes/${id}`);
                Swal.fire('Eliminado!', 'El almacén ha sido eliminado.', 'success');
                fetchAlmacenes(); // Refresca la lista de almacenes
            } catch (error) {
                Swal.fire('Error', 'Error al eliminar almacén.', 'error');
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            id: '',
            nombre: '',
            descripcion: '',
        });
    };

    return (
        <div>
            <h2>Gestión de Almacenes</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Almacén
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {almacenes.map((almacen) => (
                        <tr key={almacen.id}>
                            <td>{almacen.id}</td>
                            <td>{almacen.nombre}</td>
                            <td>{almacen.descripcion}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(almacen)}>Editar</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(almacen.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Almacén' : 'Agregar Almacén'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa el nombre del almacén" 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa la descripción" 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Actualizar Almacén' : 'Agregar Almacén'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default InventarioAlmacenManagement;
