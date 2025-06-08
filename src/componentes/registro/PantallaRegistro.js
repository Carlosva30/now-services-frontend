import React, { useState } from 'react';
import axios from '../../api/axios';

const serviciosDisponibles = [
  'Electricista',
  'Plomero',
  'Pintor',
  'Mecánico',
  'Carpintero',
  'Técnico en electrodomésticos',
  'Jardinero',
  'Cerrajero',
  'Otros'
];

const PantallaRegistro = ({ onRegistro }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [serviciosOfrecidos, setServiciosOfrecidos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

  const handleServicioChange = (servicio) => {
    setServiciosOfrecidos(prev =>
      prev.includes(servicio)
        ? prev.filter(s => s !== servicio)
        : [...prev, servicio]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tipoUsuario) {
      setMensaje('Por favor selecciona si eres Cliente o Experto.');
      setExito(false);
      return;
    }

    try {
      await axios.post('/auth/registro', {
        nombre,
        correo,
        contraseña,
        tipoUsuario,
        serviciosOfrecidos: tipoUsuario === 'experto' ? serviciosOfrecidos : []
      });

      setExito(true);
      setMensaje('¡Usuario registrado exitosamente! ✅');

      setTimeout(() => {
        if (onRegistro) onRegistro(tipoUsuario);
      }, 2000);
    } catch (error) {
      setExito(false);
      setMensaje(error.response?.data?.mensaje || 'Error al registrarse');
      console.error('❌ Error en el registro:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1e318a' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '340px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#1e318a' }}>Registro</h2>

        <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required style={inputStyle} />

        <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} required style={inputStyle}>
          <option value="">Selecciona tu tipo de usuario</option>
          <option value="cliente">Cliente</option>
          <option value="experto">Experto</option>
        </select>

        {tipoUsuario === 'experto' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Servicios ofrecidos:</label>
            <div style={{ maxHeight: '150px', overflowY: 'auto', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
              {serviciosDisponibles.map(servicio => (
                <div key={servicio}>
                  <label>
                    <input
                      type="checkbox"
                      checked={serviciosOfrecidos.includes(servicio)}
                      onChange={() => handleServicioChange(servicio)}
                      style={{ marginRight: '5px' }}
                    />
                    {servicio}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" style={{ ...inputStyle, backgroundColor: '#1e318a', color: '#fff', fontWeight: 'bold' }}>
          Registrarse
        </button>

        {mensaje && (
          <p style={{ color: exito ? 'green' : 'red', marginTop: '15px', textAlign: 'center' }}>{mensaje}</p>
        )}
      </form>
    </div>
  );
};

const inputStyle = {
  marginBottom: '10px',
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px'
};

export default PantallaRegistro;
