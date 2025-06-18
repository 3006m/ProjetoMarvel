import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import md5 from "blueimp-md5";
import "../style/Api.css";

const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";
const LIMITE_POR_PAGINA = 100;
const LOCAL_STORAGE_OFFSET_KEY = "marvel_characters_offset";

function ListaPersonagens() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [offset, setOffset] = useState(() => {
    const savedOffset = localStorage.getItem(LOCAL_STORAGE_OFFSET_KEY);
    return savedOffset ? parseInt(savedOffset, 10) : 0;
  });
  const [totalPersonagens, setTotalPersonagens] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_OFFSET_KEY, offset.toString());
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

  const handleClickCard = (personagemId) => {
    navigate(`/personagem/${personagemId}`);
  };

  const paginaAtual = offset / LIMITE_POR_PAGINA + 1;
  const totalPaginas = Math.ceil(totalPersonagens / LIMITE_POR_PAGINA);

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <button onClick={paginaAnterior} disabled={offset === 0} className="pagination-button">
          Página Anterior
        </button>
        <span style={{ margin: "0 15px" }}>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={proximaPagina}
          disabled={offset + LIMITE_POR_PAGINA >= totalPersonagens}
          className="pagination-button"
        >
          Próxima Página
        </button>
      </div>

      {carregando ? (
        <p>Carregando personagens...</p>
      ) : (
        <div className="lista-personagens-container">
          {personagens.map((heroi) => (
            <div
              key={heroi.id}
              onClick={() => handleClickCard(heroi.id)}
              className="personagem-card"
              style={{ cursor: "pointer" }}
            >
              <img
                src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
                alt={heroi.name}
              />
              <h3>{heroi.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaPersonagens;