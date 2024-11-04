import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const InsumoManagement = () => {
    const [insumos, setInsumos] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        tipo: '',
        diametroStandar: '',
        pesoStandar: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchInsumos();
    }, []);

    const fetchInsumos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/insumos');
            setInsumos(response.data);
        } catch (error) {
            console.error('Error al obtener insumos:', error);
            setError('Error al obtener insumos.');
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
        
        // Validar que los campos numéricos sean válidos
        if (formData.diametroStandar !== '' && isNaN(formData.diametroStandar)) {
            setError('El diámetro estándar debe ser un número.');
            return;
        }
        
        if (formData.pesoStandar !== '' && isNaN(formData.pesoStandar)) {
            setError('El peso estándar debe ser un número.');
            return;
        }
    
        try {
            const { id, ...dataToSend } = formData; // Excluimos el id
            const formattedData = {
                ...dataToSend,
                diametroStandar: dataToSend.diametroStandar !== '' ? parseFloat(dataToSend.diametroStandar) : null,
                pesoStandar: dataToSend.pesoStandar !== '' ? parseFloat(dataToSend.pesoStandar) : null,
            };
    
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/insumos/${id}`, formattedData);
                setSuccess('Insumo actualizado exitosamente!');
            } else {
                await axios.post('http://localhost:3001/api/insumos', formattedData); // Enviamos sin el id
                setSuccess('Insumo creado exitosamente!');
            }
            setError('');
            fetchInsumos(); // Actualizar la lista de insumos
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: isEditing ? 'Insumo actualizado exitosamente!' : 'Insumo creado exitosamente!',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error al guardar insumo:', error.response ? error.response.data : error.message);
            setError('Error al guardar insumo: ' + (error.response ? error.response.data : 'Error desconocido.'));
            setSuccess('');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response ? error.response.data : 'Error al guardar insumo.',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    const handleEdit = (insumo) => {
        setFormData(insumo);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar este insumo después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/api/insumos/${id}`);
                setSuccess('Insumo eliminado exitosamente!');
                fetchInsumos(); // Actualizar la lista de insumos
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado!',
                    text: 'El insumo ha sido eliminado.',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                console.error('Error al eliminar insumo:', error);
                setError('Error al eliminar insumo.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar insumo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            id: '',
            nombre: '',
            tipo: '',
            diametroStandar: '',
            pesoStandar: '',
        });
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <h2>Gestión de Insumos</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Agregar Insumo
            </Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Diámetro Estándar</th>
                        <th>Peso Estándar</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {insumos.map((insumo) => (
                        <tr key={insumo.id}>
                            <td>{insumo.id}</td>
                            <td>{insumo.nombre}</td>
                            <td>{insumo.tipo}</td>
                            <td>{insumo.diametroStandar}</td>
                            <td>{insumo.pesoStandar}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(insumo)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDelete(insumo.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Insumo' : 'Agregar Insumo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa el nombre del insumo" 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formTipo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="tipo" 
                                value={formData.tipo} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="DIAMETRO">DIAMETRO</option>
                                <option value="KILO">KILO</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDiametroStandar">
                            <Form.Label>Diámetro Estándar</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.01" 
                                placeholder="Ingresa el diámetro estándar" 
                                name="diametroStandar"
                                value={formData.diametroStandar}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPesoStandar">
                            <Form.Label>Peso Estándar</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.01" 
                                placeholder="Ingresa el peso estándar" 
                                name="pesoStandar"
                                value={formData.pesoStandar}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Actualizar Insumo' : 'Agregar Insumo'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default InsumoManagement;
