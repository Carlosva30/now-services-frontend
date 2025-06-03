import React, { useState } from 'react';
import Login from './componentes/login/Login';
import PantallaRegistro from './componentes/registro/PantallaRegistro';
import PantallaInicioCliente from './componentes/inicio/PantallaInicioCliente';
import PantallaPerfilExperto from './componentes/experto/PantallaPerfilExperto';
import PantallaSolicitudesExperto from './componentes/experto/PantallaSolicitudesExperto';
import PantallaHistorialCliente from './componentes/inicio/PantallaHistorialCliente';
import PantallaPagoServicio from './componentes/pagos/PantallaPagoServicio';
import PantallaResena from './componentes/resenas/PantallaResena';

function App() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [solicitudParaPagar, setSolicitudParaPagar] = useState(null);
  const [solicitudParaResena, setSolicitudParaResena] = useState(null);

  return (
    <div>
      {pantalla === 'login' && (
        <Login
          onRegistro={() => setPantalla('registro')}
          onLoginExitoso={(tipo, datosUsuario) => {
            setUsuario(datosUsuario);
            if (tipo === 'cliente') {
              setPantalla('inicio');
            } else {
              setPantalla('perfilExperto');
            }
          }}
        />
      )}

      {pantalla === 'registro' && (
        <PantallaRegistro
          onRegistro={(tipo, datosUsuario) => {
            setUsuario(datosUsuario);
            if (tipo === 'cliente') {
              setPantalla('inicio');
            } else {
              setPantalla('perfilExperto');
            }
          }}
        />
      )}

      {pantalla === 'inicio' && usuario && (
        <PantallaInicioCliente
          clienteEmail={usuario.correo}
          clienteId={usuario._id}
          onCambiarPantalla={(pantallaDestino) => setPantalla(pantallaDestino)}
        />
      )}

      {pantalla === 'perfilExperto' && usuario && (
        <PantallaPerfilExperto
          experto={usuario}
          onVerSolicitudes={() => setPantalla('solicitudesExperto')}
        />
      )}

      {pantalla === 'solicitudesExperto' && usuario && (
        <PantallaSolicitudesExperto
          experto={usuario}
          onVolver={() => setPantalla('perfilExperto')}
        />
      )}

      {pantalla === 'historial' && usuario && (
        <PantallaHistorialCliente
          clienteId={usuario._id}
          onVolver={() => setPantalla('inicio')}
          setSolicitudParaPagar={setSolicitudParaPagar}
          setPantalla={setPantalla}
          setSolicitudParaResena={setSolicitudParaResena}
        />
      )}

      {pantalla === 'pagoServicio' && solicitudParaPagar && (
        <PantallaPagoServicio
          solicitud={solicitudParaPagar}
          onPagoCompleto={() => {
            setSolicitudParaResena(solicitudParaPagar);
            setSolicitudParaPagar(null);
            setPantalla('resena');
          }}
          onCancelar={() => {
            setSolicitudParaPagar(null);
            setPantalla('historial');
          }}
        />
      )}

      {pantalla === 'resena' && solicitudParaResena && (
        <PantallaResena
          solicitud={solicitudParaResena}
          onFinalizar={() => {
            setSolicitudParaResena(null);
            setPantalla('historial');
          }}
        />
      )}
    </div>
  );
}

export default App;
