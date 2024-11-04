import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TurnosTable from './ObtenerTurnos';

const IniciosFinalesManagement = () => {
    const [insumos, setInsumos] = useState([]);
    const [selectedInsumos, setSelectedInsumos] = useState([]);
    const [cantidadInicial, setCantidadInicial] = useState('');
    const [cantidadFinal, setCantidadFinal] = useState('');
    const [idInsumo, setIdInsumo] = useState('');
    const [nombre, setNombre] = useState('');
    const [message, setMessage] = useState('');
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        fetchInsumos();
        fetchTurnos(); // Cargar turnos al inicio
    }, []);

    const fetchInsumos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/insumos');
            setInsumos(response.data || []);
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
            setInsumos([]);
        }
    };

    const fetchTurnos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/turnos');
            setTurnos(response.data || []);
        } catch (error) {
            console.error('Error al obtener los turnos:', error);
            setTurnos([]);
        }
    };

    const handleSelectInsumo = (e) => {
        const selectedId = e.target.value;
        setIdInsumo(selectedId);

        const selectedInsumo = insumos.find((insumo) => String(insumo.id) === selectedId);
        setNombre(selectedInsumo ? selectedInsumo.nombre : '');
    };

    const handleAddInsumo = () => {
        if (idInsumo && nombre && cantidadInicial >= 0 && cantidadFinal >= 0) {
            setSelectedInsumos([...selectedInsumos, { id_insumo: idInsumo, nombre, cantidad_inicial: cantidadInicial, cantidad_final: cantidadFinal }]);
            setCantidadInicial('');
            setCantidadFinal('');
            setIdInsumo('');
            setNombre('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/turnos', { insumos: selectedInsumos });
            setMessage('Turno registrado con éxito');
            setSelectedInsumos([]);
            fetchTurnos(); // Actualiza la lista de turnos
        } catch (error) {
            setMessage('Error al registrar el turno');
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Registrar Turno</h2>
            <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded">
                <div className="mb-3">
                    <h4>Agregar Insumo</h4>
                    <label className="form-label">Seleccione el Insumo</label>
                    <select
                        className="form-control"
                        value={idInsumo}
                        onChange={handleSelectInsumo}
                    >
                        <option value="">Seleccione un insumo</option>
                        {insumos.map((insumo) => (
                            <option key={insumo.id} value={insumo.id}>
                                {insumo.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Cantidad Inicial</label>
                        <input
                            type="number"
                            className="form-control"
                            value={cantidadInicial}
                            onChange={(e) => setCantidadInicial(e.target.value)}
                            placeholder="Ingrese cantidad inicial"
                        />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Cantidad Final</label>
                        <input
                            type="number"
                            className="form-control"
                            value={cantidadFinal}
                            onChange={(e) => setCantidadFinal(e.target.value)}
                            placeholder="Ingrese cantidad final"
                        />
                    </div>
                </div>

                <button type="button" className="btn btn-primary mb-3" onClick={handleAddInsumo}>
                    Agregar Insumo
                </button>

                <h4>Lista de Insumos Seleccionados</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID Insumo</th>
                            <th>Nombre</th>
                            <th>Cantidad Inicial</th>
                            <th>Cantidad Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedInsumos.map((insumo, index) => (
                            <tr key={index}>
                                <td>{insumo.id_insumo}</td>
                                <td>{insumo.nombre}</td>
                                <td>{insumo.cantidad_inicial}</td>
                                <td>{insumo.cantidad_final}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit" className="btn btn-success w-100">Registrar Turno</button>
            </form>

            {message && <p className="mt-3 alert alert-info text-center">{message}</p>}
            <TurnosTable turnos={turnos} />
        </div>
    );
};

export default IniciosFinalesManagement;
