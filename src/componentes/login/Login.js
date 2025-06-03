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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #1e3c72, #2a5298)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#1e3c72', textAlign: 'center' }}>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{
            padding: '12px',
            marginBottom: '15px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          style={{
            padding: '12px',
            marginBottom: '15px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <button
          onClick={() => alert('Funcionalidad por implementar')}
          style={{
            background: 'none',
            color: '#007bff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '15px',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          onClick={manejarLogin}
          style={{
            padding: '12px',
            width: '100%',
            backgroundColor: '#1e3c72',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
        >
          Ingresar
        </button>

        <button
          onClick={onRegistro}
          style={{
            padding: '12px',
            width: '100%',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>

        {error && <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
