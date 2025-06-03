import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const PantallaHistorialCliente = ({ clienteId, onVolver, setSolicitudParaPagar, setPantalla }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const res = await axios.get(`/solicitudes?usuarioId=${clienteId}&tipo=cliente`);
        setSolicitudes(res.data);
      } catch (err) {
        console.error('❌ Error al obtener solicitudes del cliente:', err);
      } finally {
        setCargando(false);
      }
    };

    if (clienteId) {
      obtenerSolicitudes();
    } else {
      setCargando(false);
    }
  }, [clienteId]);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`/solicitudes/${id}/estado`, { nuevoEstado });
      setSolicitudes((prev) =>
        prev.map((sol) =>
          sol._id === id ? { ...sol, estado: nuevoEstado } : sol
        )
      );
    } catch (err) {
      console.error('❌ Error al actualizar estado:', err);
    }
  };

  const irAPago = (solicitud) => {
    setSolicitudParaPagar(solicitud);
    setPantalla('pagoServicio');
  };

  if (cargando) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>⏳ Cargando historial...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1e318a' }}>📜 Historial de Solicitudes</h2>

      {solicitudes.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '30px' }}>No hay solicitudes registradas.</p>
      ) : (
        solicitudes.map((solicitud) => (
          <div key={solicitud._id} style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            margin: '10px 0',
            borderRadius: '10px',
            boxShadow: '0 0 6px rgba(0,0,0,0.1)'
          }}>
            <p><strong>Servicio:</strong> {solicitud.servicio}</p>
            <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
            <p><strong>Valor Propuesto:</strong> ${solicitud.valorPropuesto}</p>
            <p><strong>Estado:</strong> {solicitud.estado}</p>
            <p><strong>Fecha:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>

            {/* Cliente confirma que desea que se realice */}
            {solicitud.estado === 'aceptada' && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => cambiarEstado(solicitud._id, 'confirmada_cliente')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Confirmar que deseo realizar este servicio
                </button>
              </div>
            )}

            {/* Cliente paga y completa */}
            {solicitud.estado === 'realizado_experto' && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => irAPago(solicitud)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  💳 Pagar y completar el servicio
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={onVolver}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1e318a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⬅ Volver
        </button>
      </div>
    </div>
  );
};

export default PantallaHistorialCliente;
