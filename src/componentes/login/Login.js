import React, { useState } from 'react';
import axios from '../../api/axios';

function Login({ onLoginExitoso, onRegistro }) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const manejarLogin = async () => {
    if (!correo || !contraseña) {
      setError('Por favor llena todos los campos.');
      return;
    }

    try {
      const respuesta = await axios.post('/auth/login', {
        correo,
        contraseña
      });

      const { token, usuario, tipoUsuario } = respuesta.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('tipoUsuario', tipoUsuario);

      if (onLoginExitoso) {
        onLoginExitoso(tipoUsuario, usuario);
      }
    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err);
      setError(err.response?.data?.mensaje || 'Credenciales inválidas');
    }
  };

  return (
    <div className="login" style={{ padding: 20, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      {/* para implementar despues */}
      <button
        onClick={() => alert('Funcionalidad por implementar')}
        style={{ background: 'none', color: '#007bff', border: 'none', cursor: 'pointer', marginBottom: '10px' }}
      >
        ¿Olvidaste tu contraseña?
      </button>

      <br />

      <button
        onClick={manejarLogin}
        style={{ padding: '10px 20px', marginBottom: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Ingresar
      </button>

      {/*BOTÓN DE REGISTRO LLAMANDO A onRegistro */}
      <button
        onClick={() => onRegistro()}
        style={{ padding: '10px 20px', width: '100%', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Registrarse
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}

export default Login;
