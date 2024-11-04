// src/componentes/SalidaManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Importa SweetAlert
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS

const SalidaManagement = ({ stockGeneral, fetchStockGeneral }) => {
  const [salida, setSalida] = useState({ nroGuia: "", productos: [] });
  const [salidas, setSalidas] = useState([]); // Estado para almacenar las salidas

  const fetchSalidas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/salidas");
      setSalidas(response.data);
    } catch (error) {
      console.error("Error al obtener las salidas", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener las salidas.",
      });
    }
  };

  useEffect(() => {
    fetchSalidas(); // Llama a fetchSalidas cuando se monta el componente
  }, []); // Solo se ejecuta al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalida((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProducto = () => {
    setSalida((prev) => ({
      ...prev,
      productos: [...prev.productos, { stockGeneralId: "", cantidad: 1 }],
    }));
  };

  const handleProductoChange = (index, e) => {
    const { name, value } = e.target;
    const newProductos = [...salida.productos];
    newProductos[index][name] = value;
    setSalida((prev) => ({ ...prev, productos: newProductos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validSalida = salida.productos.every((producto) => {
        const stockItem = stockGeneral.find(
          (item) => item.id === parseInt(producto.stockGeneralId)
        );
        return stockItem && stockItem.cantidadTotal >= producto.cantidad;
      });

      if (!validSalida) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No hay suficiente stock disponible para uno o más productos.",
        });
        return;
      }

      await axios.post("http://localhost:3001/api/salidas", salida);

      await Promise.all(
        salida.productos.map(async (producto) => {
          const stockItem = stockGeneral.find(
            (item) => item.id === parseInt(producto.stockGeneralId)
          );
          if (stockItem) {
            const updatedStock = stockItem.cantidadTotal - producto.cantidad;
            await axios.put(
              `http://localhost:3001/api/stockGeneral/${stockItem.id}`,
              { cantidadTotal: updatedStock }
            );
          }
        })
      );

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Salida registrada exitosamente.",
      });

      setSalida({ nroGuia: "", productos: [] });
      fetchStockGeneral();
      // Actualizar las salidas después de registrar una nueva
      fetchSalidas();
    } catch (error) {
      console.error("Error al registrar la salida", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar la salida.",
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="mt-4">
        <h2>Registrar Salida</h2>
        <div className="mb-3">
          <label htmlFor="nroGuia" className="form-label">
            Número de Guía:
          </label>
          <input
            type="text"
            name="nroGuia"
            id="nroGuia"
            className="form-control"
            value={salida.nroGuia}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Productos</h3>
        {salida.productos.map((producto, index) => (
          <div key={index} className="mb-3">
            <select
              name="stockGeneralId"
              className="form-select"
              value={producto.stockGeneralId}
              onChange={(e) => handleProductoChange(index, e)}
              required
            >
              <option value="">Seleccionar producto</option>
              {stockGeneral.map((stockItem) => (
                <option key={stockItem.id} value={stockItem.id}>
                  {stockItem.producto.nombre} ({stockItem.medida.nombre}) - Stock
                  disponible: {stockItem.cantidadTotal}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="cantidad"
              className="form-control mt-2"
              value={producto.cantidad}
              onChange={(e) => handleProductoChange(index, e)}
              min="1"
              required
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={handleAddProducto}>
          Agregar Producto
        </button>
        <button type="submit" className="btn btn-primary">Registrar Salida</button>
      </form>

      <h2 className="mt-4">Registro de Salidas</h2>
      <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Número de Guía</th>
              <th>Fecha</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map((salida) => (
              <tr key={salida.id}>
                <td>{salida.nroGuia}</td>
                <td>{new Date(salida.createdAt).toLocaleString()}</td>
                <td>
                  <ul>
                    {salida.SalidasDetalles.map((detalle) => (
                      <li key={detalle.id}>
                        Producto ID: {detalle.stockGeneralId}, Cantidad: {detalle.cantidad}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalidaManagement;
