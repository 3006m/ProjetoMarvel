import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListaPersonagens from './components/ListaPersonagens'; // Seu componente atual
import DetalhesPersonagem from './components/DetalhesPersonagens'; // O componente que vamos criar

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListaPersonagens />} />
        {/* Rota para a página de detalhes, usando um ID como parâmetro */}
        <Route path="/personagem/:id" element={<DetalhesPersonagem />} />
      </Routes>
    </Router>
  );
}

export default App;