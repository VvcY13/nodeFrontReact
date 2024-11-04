// src/componentes/RegistroProduccion.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProduccionManagement = () => {
    const [produccion, setProduccion] = useState([]);
    const [productos, setProductos] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        productoId: '',
        medidaId: '',
        cantidad: '',
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProductos();
        fetchMedidas();
        fetchProduccion();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            Swal.fire('Error', 'Error al obtener productos.', 'error');
        }
    };

    const fetchMedidas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/medidas');
            setMedidas(response.data);
        } catch (error) {
            console.error('Error al obtener medidas:', error);
            Swal.fire('Error', 'Error al obtener medidas.', 'error');
        }
    };

    const fetchProduccion = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/produccion');
            setProduccion(response.data);
        } catch (error) {
            console.error('Error al obtener registros de producción:', error);
            Swal.fire('Error', 'Error al obtener registros de producción.', 'error');
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
            if (formData.id) {
                await axios.put(`http://localhost:3001/api/produccion/${formData.id}`, formData);
                Swal.fire('Éxito', 'Registro de producción editado exitosamente!', 'success');
            } else {
                await axios.post('http://localhost:3001/api/produccion', formData);
                Swal.fire('Éxito', 'Registro de producción agregado exitosamente!', 'success');
            }
            fetchProduccion();
            handleClose();
        } catch (error) {
            console.error('Error al guardar producción:', error);
            Swal.fire('Error', 'Error al guardar producción.', 'error');
        }
    };

    const handleEdit = (registro) => {
        setFormData({
            id: registro.id,
            productoId: registro.productoId,
            medidaId: registro.medidaId,
            cantidad: registro.cantidad,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/api/produccion/${id}`);
                Swal.fire('Eliminado!', 'Registro de producción eliminado exitosamente!', 'success');
                fetchProduccion();
            } catch (error) {
                console.error('Error al eliminar producción:', error);
                Swal.fire('Error', 'Error al eliminar producción.', 'error');
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({
            id: '',
            productoId: '',
            medidaId: '',
            cantidad: '',
        });
    };

    return (
        <div>
            <h2>Registro de Producción</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Producción
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Medida</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {produccion.map((registro) => (
                        <tr key={registro.id}>
                            <td>{registro.id}</td>
                            <td>{registro.Product.nombre}</td>
                            <td>{registro.Medida.nombre}</td>
                            <td>{registro.cantidad}</td>
                            <td>{new Date(registro.createdAt).toLocaleString()}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(registro)}>
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(registro.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Editar Registro de Producción' : 'Agregar Registro de Producción'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formProducto">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="productoId" 
                                value={formData.productoId} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Seleccione un producto</option>
                                {productos.map(producto => (
                                    <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formMedida">
                            <Form.Label>Medida</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="medidaId" 
                                value={formData.medidaId} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Seleccione una medida</option>
                                {medidas.map(medida => (
                                    <option key={medida.id} value={medida.id}>{medida.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formCantidad">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Ingrese la cantidad producida" 
                                name="cantidad" 
                                value={formData.cantidad} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {formData.id ? 'Actualizar Producción' : 'Guardar Producción'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProduccionManagement;
