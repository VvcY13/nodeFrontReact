import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const InsumoManagement = () => {
  const [insumos, setInsumos] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    tipo: "",
    unidadMedida: "",
    diametroInterno: "",
    diametroExterno: "",
    espesorTela: "",
    pesoStandar: "",
    pesoPorBolsa: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/insumos");
      setInsumos(response.data);
    } catch (error) {
      console.error("Error al obtener insumos:", error);
      setError("Error al obtener insumos.");
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

    // Validar campos numéricos
    const fieldsToValidate = [
      "diametroInterno",
      "diametroExterno",
      "espesorTela",
      "pesoStandar",
      "pesoPorBolsa",
    ];
    for (const field of fieldsToValidate) {
      if (formData[field] && isNaN(formData[field])) {
        setError(`El campo ${field} debe ser un número.`);
        return;
      }
    }

    try {
      const { id, ...dataToSend } = formData; // Excluye el id
      const formattedData = {
        ...dataToSend,
        diametroInterno: dataToSend.diametroInterno ? parseFloat(dataToSend.diametroInterno) : null,
        diametroExterno: dataToSend.diametroExterno ? parseFloat(dataToSend.diametroExterno) : null,
        espesorTela: dataToSend.espesorTela ? parseFloat(dataToSend.espesorTela) : null,
        pesoStandar: dataToSend.pesoStandar ? parseFloat(dataToSend.pesoStandar) : null,
        pesoPorBolsa: dataToSend.pesoPorBolsa ? parseFloat(dataToSend.pesoPorBolsa) : null,
      };

      if (isEditing) {
        await axios.put(`http://localhost:3001/api/insumos/${id}`, formattedData);
      } else {
        await axios.post("http://localhost:3001/api/insumos", formattedData);
      }

      setError("");
      fetchInsumos(); // Actualiza la lista de insumos
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: isEditing ? "Insumo actualizado exitosamente!" : "Insumo creado exitosamente!",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al guardar insumo:", error);
      setError("Error al guardar insumo.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar insumo.",
        confirmButtonText: "Aceptar",
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
      title: "¿Estás seguro?",
      text: "No podrás recuperar este insumo después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/insumos/${id}`);
        fetchInsumos();
        Swal.fire("Eliminado!", "El insumo ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar insumo:", error);
        setError("Error al eliminar insumo.");
        Swal.fire("Error", "Error al eliminar insumo.", "error");
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      id: "",
      nombre: "",
      tipo: "",
      unidadMedida: "",
      diametroInterno: "",
      diametroExterno: "",
      espesorTela: "",
      pesoStandar: "",
      pesoPorBolsa: "",
    });
    setError("");
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
            <th>Unidad de Medida</th>
            <th>Diámetro Interno</th>
            <th>Diámetro Externo</th>
            <th>Espesor de Tela</th>
            <th>Peso Estándar</th>
            <th>Peso por Bolsa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id}>
              <td>{insumo.id ?? "--"}</td>
              <td>{insumo.nombre ?? "--"}</td>
              <td>{insumo.tipo ?? "--"}</td>
              <td>{insumo.unidadMedida ?? "--"}</td>
              <td>{insumo.diametroInterno ?? "--"}</td>
              <td>{insumo.diametroExterno ?? "--"}</td>
              <td>{insumo.espesorTela ?? "--"}</td>
              <td>{insumo.pesoStandar ?? "--"}</td>
              <td>{insumo.pesoPorBolsa ?? "--"}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(insumo)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(insumo.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Insumo" : "Agregar Insumo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Form fields for each insumo attribute */}
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
              <Form.Control as="select" name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="ROLLO">ROLLO</option>
                <option value="POLVO">POLVO</option>
                <option value="CAJA">CAJA</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUnidadMedida">
              <Form.Label>Unidad de Medida</Form.Label>
              <Form.Control as="select" name="unidadMedida" value={formData.unidadMedida} onChange={handleChange} required>
                <option value="">Seleccione una unidad</option>
                <option value="metros">Metros</option>
                <option value="kilos">Kilos</option>
                <option value="unidades">Unidades</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDiametroInterno">
              <Form.Label>Diámetro Interno</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="Ingresa el diámetro interno" name="diametroInterno" value={formData.diametroInterno} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formDiametroExterno">
              <Form.Label>Diámetro Externo</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="Ingresa el diámetro externo" name="diametroExterno" value={formData.diametroExterno} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEspesorTela">
              <Form.Label>Espesor de Tela</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="Ingresa el espesor de la tela" name="espesorTela" value={formData.espesorTela} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formPesoStandar">
              <Form.Label>Peso Estándar</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="Ingresa el peso estándar" name="pesoStandar" value={formData.pesoStandar} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formPesoPorBolsa">
              <Form.Label>Peso por Bolsa</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="Ingresa el peso por bolsa" name="pesoPorBolsa" value={formData.pesoPorBolsa} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {isEditing ? "Guardar cambios" : "Agregar insumo"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InsumoManagement;
