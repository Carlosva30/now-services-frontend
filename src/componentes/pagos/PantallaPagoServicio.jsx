import React, { useState } from 'react';
import axios from '../../api/axios';

const PantallaPagoServicio = ({ solicitud, onPagoCompleto, onCancelar }) => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const realizarPago = async () => {
    setCargando(true);
    setMensaje('');
    try {
      // ✅ Corregimos la ruta
      await axios.put(`/solicitudes/${solicitud._id}/estado`, {
        nuevoEstado: 'completado'
      });

      setMensaje('✅ Pago simulado y servicio marcado como completado.');
      setTimeout(() => {
        onPagoCompleto(); // notifica al padre que el pago se hizo
      }, 1000);
    } catch (err) {
      console.error('❌ Error al realizar el pago:', err);
      setMensaje('❌ Hubo un problema al realizar el pago.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#1e318a', textAlign: 'center' }}>
        💳 Confirmar y Pagar Servicio
      </h2>
      <p><strong>Servicio:</strong> {solicitud.servicio}</p>
      <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
      <p><strong>Valor:</strong> ${solicitud.valorPropuesto}</p>
      <hr />
      <p>Este es un pago simulado. Al confirmar, se marcará el servicio como completado.</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={onCancelar}
          style={{
            backgroundColor: '#ccc',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⬅ Cancelar
        </button>

        <button
          onClick={realizarPago}
          disabled={cargando}
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {cargando ? 'Procesando...' : '✅ Pagar y confirmar'}
        </button>
      </div>

      {mensaje && <p style={{ marginTop: '20px', textAlign: 'center' }}>{mensaje}</p>}
    </div>
  );
};

export default PantallaPagoServicio;
