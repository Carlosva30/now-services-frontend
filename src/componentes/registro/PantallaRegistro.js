import React, { useState } from 'react';
import axios from '../../api/axios';

const serviciosDisponibles = [
  'Fontanero',
  'Electricista',
  'Aseo Doméstico',
  'Carpintero',
  'Pintor',
  'Tapicero',
  'Jardinero',
  'Lavado de Alfombras',
  'Lavado de Muebles',
  'Cerrajero',
  'Técnico de electrodomésticos',
  'Instalador de gas',
  'Montaje de muebles',
  'Instalación de cámaras o alarmas',
  'Sistemas contra incendios',
];

const PantallaRegistro = ({ onRegistroExitoso, cambiarPantalla }) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    tipoUsuario: 'cliente',
    servicios: [],
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (servicio) => {
    const yaSeleccionado = formulario.servicios.includes(servicio);
    const nuevosServicios = yaSeleccionado
      ? formulario.servicios.filter((s) => s !== servicio)
      : [...formulario.servicios, servicio];
    setFormulario({ ...formulario, servicios: nuevosServicios });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      await axios.post('/auth/registro', formulario);
      setMensaje('✅ Registro exitoso, inicia sesión.');
      setTimeout(() => onRegistroExitoso(), 1000);
    } catch (err) {
      console.error('❌ Error en el registro:', err);
      setMensaje('❌ Ocurrió un error al registrarse.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.contenedor}>
      <h2 style={styles.titulo}>📝 Crear una cuenta</h2>

      <form onSubmit={handleSubmit} style={styles.formulario}>
        <label>Nombre completo</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
          placeholder="Ej. Juan Pérez"
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="correo"
          value={formulario.correo}
          onChange={handleChange}
          required
          placeholder="correo@ejemplo.com"
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={formulario.contraseña}
          onChange={handleChange}
          required
          placeholder="Mínimo 6 caracteres"
        />

        <label>Tipo de Usuario</label>
        <select
          name="tipoUsuario"
          value={formulario.tipoUsuario}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="cliente">Cliente</option>
          <option value="experto">Experto</option>
        </select>

        {formulario.tipoUsuario === 'experto' && (
          <div>
            <label>Servicios que ofrece</label>
            <div style={styles.checkboxGroup}>
              {serviciosDisponibles.map((serv) => (
                <label key={serv} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={serv}
                    checked={formulario.servicios.includes(serv)}
                    onChange={() => handleCheckboxChange(serv)}
                  />
                  {serv}
                </label>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={cargando} style={styles.boton}>
          {cargando ? 'Registrando...' : '✅ Registrarse'}
        </button>
      </form>

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}

      <p style={styles.link}>
        ¿Ya tienes cuenta?{' '}
        <span onClick={cambiarPantalla} style={styles.linkTexto}>
          Inicia sesión
        </span>
      </p>
    </div>
  );
};

const styles = {
  contenedor: {
    maxWidth: '450px',
    margin: '60px auto',
    padding: '30px',
    backgroundColor: '#f4f7fa',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  titulo: {
    textAlign: 'center',
    color: '#1e318a',
    marginBottom: '25px',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    background: '#fff',
    border: '1px solid #ddd',
    padding: '6px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  boton: {
    backgroundColor: '#1e318a',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px',
  },
  mensaje: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#444',
  },
  link: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#666',
  },
  linkTexto: {
    color: '#1e318a',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default PantallaRegistro;
