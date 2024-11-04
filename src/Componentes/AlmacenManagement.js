import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import Swal from 'sweetalert2'; // Importar SweetAlert

const AlmacenManagement = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [inventario, setInventario] = useState([]); // Estado para guardar el inventario
    const [nuevoInventario, setNuevoInventario] = useState({
        id_almacen: '',
        id_insumo: '',
        cantidad: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const almacenesResponse = await axios.get('http://localhost:3001/api/almacenes');
                const insumosResponse = await axios.get('http://localhost:3001/api/insumos');
                setAlmacenes(almacenesResponse.data);
                setInsumos(insumosResponse.data);
                await fetchInventario(); // Obtener inventario inicial
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        fetchData();
    }, []);

    const fetchInventario = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/inventarioAlmacen/almacen/1'); // Cambia el endpoint según tu API
            setInventario(response.data);
        } catch (error) {
            console.error('Error al cargar inventario:', error);
        }
    };

    const handleChange = (e) => {
        setNuevoInventario({ ...nuevoInventario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/inventarioAlmacen', nuevoInventario);
            Swal.fire({
                title: 'Éxito!',
                text: 'Insumo agregado al inventario exitosamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            setNuevoInventario({ id_almacen: '', id_insumo: '', cantidad: '' });
            await fetchInventario(); // Actualizar la tabla después de agregar
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Error al agregar el insumo: ' + error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="container mt-5">
            <h2>Agregar Insumo a Inventario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Almacén:</label>
                    <select name="id_almacen" className="form-select" value={nuevoInventario.id_almacen} onChange={handleChange} required>
                        <option value="">Seleccionar Almacén</option>
                        {almacenes.map(almacen => (
                            <option key={almacen.id} value={almacen.id}>{almacen.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Insumo:</label>
                    <select name="id_insumo" className="form-select" value={nuevoInventario.id_insumo} onChange={handleChange} required>
                        <option value="">Seleccionar Insumo</option>
                        {insumos.map(insumo => (
                            <option key={insumo.id} value={insumo.id}>{insumo.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Cantidad:</label>
                    <input type="number" name="cantidad" className="form-control" value={nuevoInventario.cantidad} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Insumo</button>
            </form>

            {/* Tabla para mostrar el inventario */}
            <h3 className="mt-5">Inventario Principal</h3>
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID Insumo</th>
                        <th>Nombre Insumo</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {inventario.map(item => (
                        <tr key={item.id_insumo}>
                            <td>{item.id_insumo}</td>
                            <td>{item.Insumo.nombre}</td> {/* Acceso a nombre de insumo */}
                            <td>{item.cantidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlmacenManagement;
