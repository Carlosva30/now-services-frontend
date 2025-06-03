import React from 'react';

const TarjetaExperto = ({ experto, onSolicitar }) => {
  return (
    <div style={estiloTarjeta}>
      <div>
        <h3 style={estiloTitulo}>{experto.nombre}</h3>
        <p><strong>📧 Correo:</strong> {experto.correo}</p>
        <p><strong>🛠 Servicios:</strong> {experto.serviciosOfrecidos?.join(', ') || 'No especificado'}</p>
      </div>

      <button
        onClick={() => onSolicitar(experto)}
        style={estiloBoton}
      >
        Solicitar servicio
      </button>
    </div>
  );
};

const estiloTarjeta = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s ease',
  cursor: 'pointer'
};

const estiloTitulo = {
  color: '#1e318a',
  fontSize: '20px',
  marginBottom: '10px'
};

const estiloBoton = {
  marginTop: '15px',
  padding: '12px',
  backgroundColor: '#1e318a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

export default TarjetaExperto;
