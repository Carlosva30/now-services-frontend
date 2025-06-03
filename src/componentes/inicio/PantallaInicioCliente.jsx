import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import TarjetaExperto from './TarjetaExperto';
import PantallaSolicitarServicio from './PantallaSolicitarServicio';

const PantallaInicioCliente = ({ onCambiarPantalla, clienteEmail, clienteId }) => {
  const [busqueda, setBusqueda] = useState('');
  const [expertos, setExpertos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [expertoSeleccionado, setExpertoSeleccionado] = useState(null);

  useEffect(() => {
    const buscarExpertos = async () => {
      setCargando(true);
      setError('');
      try {
        const respuesta = await axios.get(`/expertos?q=${busqueda}`);
        setExpertos(respuesta.data.expertos || []);
      } catch (err) {
        console.error('❌ Error al buscar expertos:', err);
        setError('No se pudieron cargar los expertos.');
      } finally {
        setCargando(false);
      }
    };

    const delay = setTimeout(() => {
      if (busqueda.trim()) {
        buscarExpertos();
      } else {
        setExpertos([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [busqueda]);

  if (expertoSeleccionado) {
    return (
      <PantallaSolicitarServicio
        experto={expertoSeleccionado}
        clienteEmail={clienteEmail}
        clienteId={clienteId}
        onVolver={() => setExpertoSeleccionado(null)}
      />
    );
  }

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f2f4f7',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#1e318a',
          marginBottom: '20px'
        }}>
          🔎 Busca un servicio
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Ej: Pintor, Plomero, Mecánico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: '12px 16px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <button
            onClick={() => {
              console.log("📥 Ver historial de cliente:", clienteId);
              onCambiarPantalla('historial');
            }}
            style={{
              backgroundColor: '#1e318a',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}
          >
            📋 Ver historial de solicitudes
          </button>
        </div>

        {cargando && <p style={{ textAlign: 'center' }}>🔄 Cargando expertos...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {expertos.map((experto) => (
            <TarjetaExperto
              key={experto._id}
              experto={experto}
              onSolicitar={() => setExpertoSeleccionado(experto)}
            />
          ))}
        </div>

        {busqueda && expertos.length === 0 && !cargando && (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#999' }}>
            😔 No se encontraron expertos con ese servicio.
          </p>
        )}
      </div>
    </div>
  );
};

export default PantallaInicioCliente;
