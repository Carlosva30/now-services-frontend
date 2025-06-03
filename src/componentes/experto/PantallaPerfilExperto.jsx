import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const PantallaPerfilExperto = ({ experto, onVerSolicitudes }) => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerResenas = async () => {
      try {
        const res = await axios.get(`/resenas/${experto._id}`);
        setResenas(res.data);
      } catch (err) {
        console.error('❌ Error al obtener reseñas:', err);
      } finally {
        setCargando(false);
      }
    };

    if (experto?._id) {
      obtenerResenas();
    }
  }, [experto]);

  const promedio = resenas.length
    ? (resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length).toFixed(1)
    : null;

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1e318a', textAlign: 'center', marginBottom: '25px' }}>
          👨‍🔧 Perfil del Experto
        </h2>

        <p><strong>Nombre:</strong> {experto.nombre}</p>
        <p><strong>Correo:</strong> {experto.correo}</p>
        <p><strong>Especialidad:</strong> {experto.servicio}</p>

        <hr style={{ margin: '25px 0' }} />

        {cargando ? (
          <p>⏳ Cargando reseñas...</p>
        ) : (
          <>
            <h3 style={{ color: '#1e318a' }}>⭐ Calificaciones</h3>
            {promedio ? (
              <p><strong>Promedio:</strong> {promedio} / 5 ({resenas.length} reseñas)</p>
            ) : (
              <p>Este experto aún no tiene reseñas.</p>
            )}

            {resenas.map((r, idx) => (
              <div key={idx} style={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <p style={{ marginBottom: '5px' }}>
                  <strong>{r.clienteId?.nombre || 'Cliente'}:</strong> {r.calificacion}/5
                </p>
                <p style={{ fontStyle: 'italic' }}>"{r.comentario}"</p>
              </div>
            ))}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={onVerSolicitudes}
            style={{
              padding: '12px 25px',
              backgroundColor: '#1e318a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📥 Ver Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PantallaPerfilExperto;
