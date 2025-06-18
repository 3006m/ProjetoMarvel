import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListaPersonagens from "./components/ListaPersonagens";
import Nav from "./components/nav";
import Favoritos from "./pages/favoritos"; // ajuste o caminho se necessário

function App() {
  return (
    <Router>
      <div>
        <h1>Marvel Heroes</h1>
        <Nav />
        <Routes>
          <Route path="/" element={<ListaPersonagens />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;