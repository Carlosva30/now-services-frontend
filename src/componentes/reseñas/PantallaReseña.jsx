import React, { useState } from 'react';
import axios from '../../api/axios';

const PantallaReseña = ({ solicitud, onFinalizar }) => {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarReseña = async () => {
    if (!comentario || calificacion < 1 || calificacion > 5) {
      setMensaje('❗️Por favor escribe un comentario y elige una calificación entre 1 y 5.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      await axios.post('/reseñas', {
        clienteId: solicitud.usuario?._id || solicitud.usuarioId, // ✅ corrección aquí
        expertoId: solicitud.expertoId,
        comentario,
        calificacion,
        solicitudId: solicitud._id,
      });

      setMensaje('✅ Reseña enviada con éxito.');
      setTimeout(() => onFinalizar(), 1000);
    } catch (err) {
      console.error('❌ Error al enviar reseña:', err);
      setMensaje('❌ No se pudo enviar la reseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1e318a' }}>⭐ Califica al Experto</h2>
      <p><strong>Servicio:</strong> {solicitud.servicio}</p>

      <label>Comentario:</label>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        rows={4}
      />

      <label>Calificación (1 a 5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={calificacion}
        onChange={(e) => setCalificacion(Number(e.target.value))}
        style={{ width: '60px', marginBottom: '20px' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onFinalizar}
          style={{
            backgroundColor: '#ccc',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⬅ Omitir
        </button>

        <button
          onClick={enviarReseña}
          disabled={cargando}
          style={{
            backgroundColor: '#1e318a',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {cargando ? 'Enviando...' : '✅ Enviar Reseña'}
        </button>
      </div>

      {mensaje && <p style={{ marginTop: '20px', textAlign: 'center' }}>{mensaje}</p>}
    </div>
  );
};

export default PantallaReseña;
