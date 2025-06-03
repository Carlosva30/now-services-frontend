import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const PantallaPerfilExperto = ({ experto, onVerSolicitudes }) => {
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReseñas = async () => {
      try {
        const res = await axios.get(`/reseñas/${experto._id}`);
        setReseñas(res.data);
      } catch (err) {
        console.error('❌ Error al obtener reseñas:', err);
      } finally {
        setCargando(false);
      }
    };

    if (experto?._id) {
      obtenerReseñas();
    }
  }, [experto]);

  const promedio = reseñas.length
    ? (reseñas.reduce((sum, r) => sum + r.calificacion, 0) / reseñas.length).toFixed(1)
    : null;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1e318a' }}>👨‍🔧 Perfil del Experto</h2>
      <p><strong>Nombre:</strong> {experto.nombre}</p>
      <p><strong>Correo:</strong> {experto.correo}</p>
      <p><strong>Especialidad:</strong> {experto.servicio}</p>

      {cargando ? (
        <p>⏳ Cargando reseñas...</p>
      ) : (
        <>
          <h3 style={{ marginTop: '30px' }}>⭐ Calificaciones</h3>
          {promedio ? (
            <p><strong>Promedio:</strong> {promedio} / 5 ({reseñas.length} reseñas)</p>
          ) : (
            <p>Este experto aún no tiene reseñas.</p>
          )}

          {reseñas.map((r, idx) => (
            <div key={idx} style={{
              backgroundColor: '#f2f2f2',
              padding: '10px',
              borderRadius: '8px',
              margin: '10px 0'
            }}>
              <p><strong>{r.clienteId?.nombre || 'Cliente'}</strong> calificó: {r.calificacion}/5</p>
              <p>"{r.comentario}"</p>
            </div>
          ))}
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={onVerSolicitudes}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1e318a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📥 Ver Solicitudes
        </button>
      </div>
    </div>
  );
};

export default PantallaPerfilExperto;
