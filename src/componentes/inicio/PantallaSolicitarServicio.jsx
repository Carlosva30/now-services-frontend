import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const PantallaSolicitarServicio = ({ experto, onVolver }) => {
  const [descripcion, setDescripcion] = useState('');
  const [valorPropuesto, setValorPropuesto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cliente, setCliente] = useState(null);

  // Recuperar datos del cliente desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (datos) {
      setCliente(datos);
    }
  }, []);

  const enviarSolicitud = async () => {
    setMensaje('');
    setError('');

    if (!descripcion.trim() || !valorPropuesto.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!cliente) {
      setError('No se pudo identificar al usuario. Intenta iniciar sesión nuevamente.');
      return;
    }

    try {
      await axios.post('/solicitudes', {
        servicio: experto.serviciosOfrecidos.join(', '),
        descripcion,
        valorPropuesto,
        email: cliente.correo,
        usuario: cliente.id, // ✅ Enviamos el ObjectId real
        expertoId: experto._id,
        estado: 'pendiente',
        fecha: new Date()
      });

      setMensaje('✅ ¡Solicitud enviada con éxito!');
      setDescripcion('');
      setValorPropuesto('');
    } catch (err) {
      console.error('❌ Error al enviar solicitud:', err);
      setError('No se pudo enviar la solicitud. Intenta de nuevo.');
    }
  };

  if (!cliente) return <p>Cargando datos del cliente...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1e318a' }}>
        Solicitar servicio a <span style={{ fontWeight: 'bold' }}>{experto.nombre}</span>
      </h2>

      <p><strong>Correo:</strong> {experto.correo}</p>
      <p><strong>Servicios:</strong> {experto.serviciosOfrecidos.join(', ')}</p>

      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Describe el problema o el servicio que necesitas..."
        rows={4}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '15px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          resize: 'none'
        }}
      />

      <input
        type="number"
        value={valorPropuesto}
        onChange={(e) => setValorPropuesto(e.target.value)}
        placeholder="Valor que estás dispuesto a pagar"
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      {mensaje && <p style={{ color: 'green', marginTop: '10px' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={onVolver}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#ccc',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>

        <button
          onClick={enviarSolicitud}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#1e318a',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Enviar Solicitud
        </button>
      </div>
    </div>
  );
};

export default PantallaSolicitarServicio;
