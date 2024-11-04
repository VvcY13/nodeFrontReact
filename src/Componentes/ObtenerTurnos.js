import React, { useState } from "react";

const TurnosTable = ({ turnos }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Lista de Turnos</h2>
      <div className="accordion" id="turnosAccordion">
        {turnos.map((turno, index) => (
          <div className="card" key={turno.id}>
            <div className="card-header" id={`heading${turno.id}`}>
              <h5 className="mb-0">
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`collapse${turno.id}`}
                >
                  Turno {turno.id}
                </button>
              </h5>
            </div>
            <div
              id={`collapse${turno.id}`}
              className={`collapse ${activeIndex === index ? "show" : ""}`}
              aria-labelledby={`heading${turno.id}`}
              data-parent="#turnosAccordion"
            >
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th>Cantidad Inicial</th>
                      <th>Cantidad Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turno.DetallesTurnos.map((detalle) => (
                      <tr key={detalle.id}>
                        <td>{detalle.Insumo.nombre}</td>
                        <td>{detalle.cantidad_inicial}</td>
                        <td>{detalle.cantidad_final}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnosTable;
