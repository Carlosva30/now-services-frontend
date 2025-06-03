import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const PantallaSolicitudesExperto = ({ experto, onVolver }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarSolicitudes = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await axios.get(`/solicitudes`, {
        params: {
          usuarioId: experto._id,
          tipo: 'experto'
        }
      });
      setSolicitudes(res.data);
    } catch (err) {
      console.error('❌ Error al cargar solicitudes:', err);
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      console.log(`📡 Enviando PUT a /solicitudes/${id} con estado: ${nuevoEstado}`);
      await axios.put(`/solicitudes/${id}/estado`, { nuevoEstado });

      setSolicitudes((prev) =>
        prev.map((sol) =>
          sol._id === id ? { ...sol, estado: nuevoEstado } : sol
        )
      );
    } catch (err) {
      console.error('❌ Error al actualizar solicitud:', err);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1e318a', textAlign: 'center' }}>
        📩 Solicitudes Recibidas
      </h2>

      <button
        onClick={onVolver}
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#ccc',
          cursor: 'pointer'
        }}
      >
        ⬅️ Volver al perfil
      </button>

      {cargando && <p>🔄 Cargando solicitudes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {solicitudes.length === 0 && !cargando && (
        <p style={{ textAlign: 'center' }}>No tienes solicitudes por ahora.</p>
      )}

      {solicitudes.map((sol) => (
        <div key={sol._id} style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Cliente:</strong> {sol.usuario?.correo || sol.email}</p>
          <p><strong>Servicio:</strong> {sol.servicio}</p>
          <p><strong>Descripción:</strong> {sol.descripcion}</p>
          <p><strong>Propuesta:</strong> ${sol.valorPropuesto}</p>
          <p><strong>Estado:</strong> {sol.estado}</p>

          {sol.estado === 'pendiente' && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => cambiarEstado(sol._id, 'aceptada')}
                style={{
                  marginRight: '10px',
                  padding: '8px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✅ Aceptar
              </button>
              <button
                onClick={() => cambiarEstado(sol._id, 'rechazada')}
                style={{
                  padding: '8px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ❌ Rechazar
              </button>
            </div>
          )}

          {sol.estado === 'confirmada_cliente' && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => cambiarEstado(sol._id, 'realizado_experto')}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🛠️ Marcar como realizado
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PantallaSolicitudesExperto;
