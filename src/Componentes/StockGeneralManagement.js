// src/componentes/StockGeneralManagement.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import SalidaManagement from './SalidaManagement';
import Swal from 'sweetalert2';

const StockGeneralManagement = () => {
    const [stockGeneral, setStockGeneral] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        productoId: '',
        medidaId: '',
        cantidadTotal: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchStockGeneral();
    }, []);

    const fetchStockGeneral = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/stockGeneral');
            setStockGeneral(response.data);
        } catch (error) {
            console.error('Error al obtener stock general:', error);
            Swal.fire('Error', 'Error al obtener stock general.', 'error');
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
            if (isEditMode) {
                await axios.put(`http://localhost:3001/api/stockGeneral/${formData.id}`, formData);
                Swal.fire('Actualizado', 'Registro de stock actualizado exitosamente!', 'success');
            } else {
                await axios.post('http://localhost:3001/api/stockGeneral', formData);
                Swal.fire('Agregado', 'Registro de stock agregado exitosamente!', 'success');
            }
            fetchStockGeneral();
            handleClose();
        } catch (error) {
            console.error('Error al guardar stock:', error);
            Swal.fire('Error', 'Error al guardar stock.', 'error');
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({
            id: '',
            productoId: '',
            medidaId: '',
            cantidadTotal: '',
        });
        setIsEditMode(false);
    };

    const handleEdit = (registro) => {
        setFormData({
            id: registro.id,
            productoId: registro.productoId,
            medidaId: registro.medidaId,
            cantidadTotal: registro.cantidadTotal,
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3001/api/stockGeneral/${id}`);
                    fetchStockGeneral();
                    Swal.fire('Eliminado', 'Registro de stock eliminado exitosamente.', 'success');
                } catch (error) {
                    console.error('Error al eliminar stock:', error);
                    Swal.fire('Error', 'Error al eliminar stock.', 'error');
                }
            }
        });
    };

    return (
        <div>
            <h2>Stock General</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Stock
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Medida</th>
                        <th>Cantidad Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {stockGeneral.map((registro) => (
                        <tr key={registro.id}>
                            <td>{registro.id}</td>
                            <td>{registro.producto?.nombre || 'Producto sin nombre'}</td>
                            <td>{registro.medida?.nombre || 'Medida sin nombre'}</td>
                            <td>{registro.cantidadTotal}</td>
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
                    <Modal.Title>{isEditMode ? 'Editar Registro de Stock' : 'Agregar Registro de Stock'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formProductoId">
                            <Form.Label>Producto ID</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="productoId" 
                                value={formData.productoId} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formMedidaId">
                            <Form.Label>Medida ID</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="medidaId" 
                                value={formData.medidaId} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formCantidadTotal">
                            <Form.Label>Cantidad Total</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="cantidadTotal" 
                                value={formData.cantidadTotal} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditMode ? 'Actualizar Stock' : 'Guardar Stock'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <SalidaManagement stockGeneral={stockGeneral} fetchStockGeneral={fetchStockGeneral} />
        </div>
    );
};

export default StockGeneralManagement;
