// importa as dependências necessárias
import React from 'react'; // importa o React
import ReactDOM from 'react-dom/client'; // importa o ReactDOM
import './index.css'; // importa o arquivo de estilos
import App from './App'; // importa o componente App
import reportWebVitals from './reportWebVitals'; // importa o arquivo de relatório de web vitals

// renderiza o componente App dentro do elemento com id root
const root = ReactDOM.createRoot( 
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
