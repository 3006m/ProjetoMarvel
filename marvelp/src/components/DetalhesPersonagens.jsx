import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import md5 from "blueimp-md5";

// Chaves de acesso à API da Marvel. Mantenha-as seguras!
const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";

// Componente para exibir os detalhes de um único personagem.
function DetalhesPersonagem() {
  // 'id' é o ID do personagem, extraído da URL.
  const { id } = useParams();
  // 'personagem' armazena os dados do personagem.
  const [personagem, setPersonagem] = useState(null);
  // 'carregando' indica se os dados estão sendo carregados.
  const [carregando, setCarregando] = useState(true);
  // 'erro' armazena qualquer erro ocorrido durante a requisição.
  const [erro, setErro] = useState(null);

  // useEffect para buscar os detalhes do personagem quando o componente é montado ou o 'id' muda.
  useEffect(() => {
    // Função assíncrona para buscar os detalhes.
    async function buscarDetalhesPersonagem() {
      try {
        setCarregando(true);
        setErro(null);

        // Cria um timestamp e um hash MD5 para autenticação na API.
        const ts = Date.now().toString();
        const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);

        // URL para buscar um personagem específico pelo ID.
        const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        // Se a API retornar dados...
        if (dados?.data?.results && dados.data.results.length > 0) {
          // Define o estado 'personagem' com o primeiro resultado.
          setPersonagem(dados.data.results[0]);
        } else {
          // Se não encontrar o personagem, define um erro.
          setErro("Personagem não encontrado.");
          console.error("Erro ao carregar detalhes do personagem:", dados);
        }
      } catch (e) {
        // Se ocorrer um erro na requisição...
        setErro("Erro na requisição dos detalhes: " + e.message);
        console.error("Erro na requisição:", e);
      } finally {
        // Define 'carregando' como false, indicando que a requisição terminou.
        setCarregando(false);
      }
    }

    // Só busca os detalhes se houver um 'id'.
    if (id) {
      buscarDetalhesPersonagem();
    }
  }, [id]); // Este useEffect é executado novamente se o 'id' mudar.

  // Se estiver carregando, exibe uma mensagem.
  if (carregando) return <p>Carregando detalhes do herói...</p>;
  // Se houver um erro, exibe a mensagem de erro.
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  // Se não houver personagem, exibe uma mensagem.
  if (!personagem) return <p>Nenhum personagem selecionado.</p>;

  // Exibe os detalhes do personagem.
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

      {/* Exibe a lista de quadrinhos em que o personagem aparece, se houver. */}
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