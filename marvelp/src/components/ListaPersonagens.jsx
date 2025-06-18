import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import md5 from "blueimp-md5";

const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";
const LIMITE_POR_PAGINA = 100;

function ListaPersonagens() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalPersonagens, setTotalPersonagens] = useState(0);
  const navigate = useNavigate(); // Inicialize o hook de navegação

  useEffect(() => {
    async function buscarPersonagens() {
      try {
        setCarregando(true);
        const ts = Date.now().toString();
        const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

        const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}&limit=${LIMITE_POR_PAGINA}&offset=${offset}`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados?.data?.results) {
          setPersonagens(dados.data.results);
          setTotalPersonagens(dados.data.total);
        } else {
          console.error("Erro ao carregar personagens:", dados);
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarPersonagens();
  }, [offset]);

  const proximaPagina = () => {
    if (offset + LIMITE_POR_PAGINA < totalPersonagens) {
      setOffset(offset + LIMITE_POR_PAGINA);
    }
  };

  const paginaAnterior = () => {
    if (offset - LIMITE_POR_PAGINA >= 0) {
      setOffset(offset - LIMITE_POR_PAGINA);
    }
  };

  // Função para lidar com o clique no card
  const handleClickCard = (personagemId) => {
    navigate(`/personagem/${personagemId}`); // Redireciona para a rota de detalhes
  };

  const paginaAtual = offset / LIMITE_POR_PAGINA + 1;
  const totalPaginas = Math.ceil(totalPersonagens / LIMITE_POR_PAGINA);

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <button onClick={paginaAnterior} disabled={offset === 0}>
          Página Anterior
        </button>
        <span style={{ margin: "0 15px" }}>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={proximaPagina}
          disabled={offset + LIMITE_POR_PAGINA >= totalPersonagens}
        >
          Próxima Página
        </button>
      </div>

        {carregando ? <p>Carregando personagens...</p> : 

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {personagens.map((heroi) => (
          <div
            key={heroi.id}
            onClick={() => handleClickCard(heroi.id)} // Adiciona o evento de clique
            style={{
              border: "1px solid #eee",
              padding: 16,
              width: 180,
              textAlign: "center",
              cursor: "pointer", // Indica que é clicável
              boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", // Pequena sombra para indicar interatividade
              transition: "transform 0.2s ease-in-out", // Efeito de transição
            }}
            // Adicione pseudo-classes para feedback visual ao passar o mouse
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
              alt={heroi.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{heroi.name}</h3>
          </div>
        ))}
      </div>
        }
    </div>
  );
}

export default ListaPersonagens;