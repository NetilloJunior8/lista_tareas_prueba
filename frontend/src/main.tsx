/*
  main.tsx - Punto de entrada de la aplicación.
  
  Este archivo es el primero que ejecuta el navegador.
  createRoot es la API moderna de React 18+ para montar
  la aplicación en el elemento #root del index.html.

  StrictMode es una herramienta de desarrollo que:
  - Detecta efectos secundarios inesperados
  - Advierte sobre APIs obsoletas
  - En desarrollo, monta los componentes dos veces para
    detectar problemas. En producción no hace nada extra.
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
