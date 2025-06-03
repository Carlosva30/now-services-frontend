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
      await axios.put(`/solicitudes/${id}/estado`, { nuevoEstado });
      setSolicitudes(prev =>
        prev.map(sol => sol._id === id ? { ...sol, estado: nuevoEstado } : sol)
      );
    } catch (err) {
      console.error('❌ Error al actualizar solicitud:', err);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div style={{
      padding: '40px',
      maxWidth: '900px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          color: '#1e318a',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          📩 Solicitudes Recibidas
        </h2>

        <button
          onClick={onVolver}
          style={{
            marginBottom: '30px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#6c757d',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ⬅️ Volver al perfil
        </button>

        {cargando && <p>🔄 Cargando solicitudes...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!cargando && solicitudes.length === 0 && (
          <p style={{ textAlign: 'center' }}>No tienes solicitudes por ahora.</p>
        )}

        {solicitudes.map(sol => (
          <div key={sol._id} style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <p><strong>Cliente:</strong> {sol.usuario?.correo || sol.email}</p>
            <p><strong>Servicio:</strong> {sol.servicio}</p>
            <p><strong>Descripción:</strong> {sol.descripcion}</p>
            <p><strong>Propuesta:</strong> ${sol.valorPropuesto}</p>
            <p><strong>Estado:</strong> {sol.estado}</p>

            {sol.estado === 'pendiente' && (
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => cambiarEstado(sol._id, 'aceptada')}
                  style={{
                    padding: '10px 20px',
                    marginRight: '10px',
                    backgroundColor: '#28a745',
                    color: '#fff',
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
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
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
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => cambiarEstado(sol._id, 'realizado_experto')}
                  style={{
                    padding: '10px 25px',
                    backgroundColor: '#007bff',
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
    </div>
  );
};

export default PantallaSolicitudesExperto;
