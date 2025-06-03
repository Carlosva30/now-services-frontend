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
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#1e318a' }}>🔎 Busca un servicio</h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Ej: Pintor, Plomero, Mecánico..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: '12px',
            width: '90%',
            maxWidth: '400px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => {
            console.log("📥 Ver historial de cliente:", clienteId);
            onCambiarPantalla('historial');
          }}
          style={{
            backgroundColor: '#1e318a',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📋 Ver historial de solicitudes
        </button>
      </div>

      {cargando && <p style={{ textAlign: 'center' }}>🔄 Cargando...</p>}
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
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          😔 No se encontraron expertos con ese servicio.
        </p>
      )}
    </div>
  );
};

export default PantallaInicioCliente;
