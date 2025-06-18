import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import md5 from "blueimp-md5";

const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";

function DetalhesPersonagem() {
  const { id } = useParams(); // Pega o 'id' da URL (ex: /personagem/123)
  const [personagem, setPersonagem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarDetalhesPersonagem() {
      try {
        setCarregando(true);
        setErro(null); // Limpa erros anteriores

        const ts = Date.now().toString();
        const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

        // URL para buscar um personagem específico pelo ID
        const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados?.data?.results && dados.data.results.length > 0) {
          setPersonagem(dados.data.results[0]); // Pega o primeiro (e único) resultado
        } else {
          setErro("Personagem não encontrado.");
          console.error("Erro ao carregar detalhes do personagem:", dados);
        }
      } catch (e) {
        setErro("Erro na requisição dos detalhes: " + e.message);
        console.error("Erro na requisição:", e);
      } finally {
        setCarregando(false);
      }
    }

    // Apenas busca se houver um ID
    if (id) {
      buscarDetalhesPersonagem();
    }
  }, [id]); // Refaz a busca se o ID da URL mudar

  if (carregando) return <p>Carregando detalhes do herói...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!personagem) return <p>Nenhum personagem selecionado.</p>; // Caso raro, mas bom para ter

  // Exibição dos detalhes do personagem
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <img
        src={`${personagem.thumbnail.path}/portrait_fantastic.${personagem.thumbnail.extension}`}
        alt={personagem.name}
        style={{ width: "100%", maxWidth: 300, borderRadius: 8, marginBottom: 20 }}
      />
      <h2>{personagem.name}</h2>
      {personagem.description ? (
        <p>{personagem.description}</p>
      ) : (
        <p>Este personagem não possui uma descrição disponível.</p>
      )}

      {/* Exemplo de outros detalhes que você pode adicionar */}
      {personagem.comics.available > 0 && (
        <>
          <h3>Aparições em Quadrinhos ({personagem.comics.available}):</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {personagem.comics.items.map((comic, index) => (
              <li key={index}>{comic.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default DetalhesPersonagem;