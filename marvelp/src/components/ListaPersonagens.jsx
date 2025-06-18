// Importa as funcionalidades necessárias do React.
// useEffect é para executar código após renderizar e useState para gerenciar o estado dos componentes.
import React, { useEffect, useState } from "react";
// useNavigate é usado para navegar entre diferentes rotas da aplicação.
import { useNavigate } from "react-router-dom";
// md5 é uma biblioteca para gerar hashes (códigos únicos), essencial para a autenticação da API da Marvel.
import md5 from "blueimp-md5";
// Importa os estilos CSS para este componente.
import "../style/Api.css";

// ---
// Estas são constantes globais que não mudam.
// CHAVE_PUBLICA e CHAVE_PRIVADA são suas credenciais para acessar a API da Marvel.
const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";
// LIMITE_POR_PAGINA define quantos personagens serão carregados por vez da API.
const LIMITE_POR_PAGINA = 100;
// LOCAL_STORAGE_OFFSET_KEY é a chave usada para armazenar a posição atual (offset) no armazenamento local do navegador.
const CHAVE_OFFSET_LOCAL_STORAGE = "marvel_characters_offset";

// ---
// Este é um componente funcional React que exibe uma lista de personagens da Marvel.
function ListaPersonagens() {
  // ---
  // Usamos 'useState' para gerenciar o estado do componente. Quando o estado muda, o componente é renderizado novamente.

  // 'personagens' armazena a lista de personagens obtidos da API. 'setPersonagens' é a função para atualizá-lo.
  const [personagens, setPersonagens] = useState([]);
  // 'carregando' indica se os dados estão sendo carregados da API (true) ou não (false).
  const [carregando, setCarregando] = useState(true);
  // 'offset' define o ponto de início para buscar personagens na API, permitindo a paginação.
  // Ele tenta carregar o último offset salvo no armazenamento local ou começa do zero.
  const [offset, setOffset] = useState(() => {
    const offsetSalvo = localStorage.getItem(CHAVE_OFFSET_LOCAL_STORAGE);
    return offsetSalvo ? parseInt(offsetSalvo, 10) : 0;
  });
  // 'totalPersonagens' armazena o número total de personagens disponíveis na API.
  const [totalPersonagens, setTotalPersonagens] = useState(0);
  // 'navegar' é uma função do React Router DOM para mudar de página.
  const navegar = useNavigate();

  // ---
  // Este 'useEffect' é acionado sempre que o 'offset' muda. Ele busca os personagens da API.
  useEffect(() => {
    // Função assíncrona para lidar com a requisição à API.
    async function buscarPersonagens() {
      try {
        // Define 'carregando' como true para mostrar uma mensagem de carregamento.
        setCarregando(true);
        // Gera um timestamp (momento atual), necessário para a autenticação da API da Marvel.
        const ts = Date.now().toString();
        // Cria um hash MD5 combinando o timestamp, a chave privada e a chave pública.
        // Isso é uma medida de segurança exigida pela API da Marvel.
        const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);
        // Monta a URL completa para a requisição da API da Marvel, incluindo todas as credenciais e parâmetros.
        const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}&limit=${LIMITE_POR_PAGINA}&offset=${offset}`;

        // Faz a requisição à API.
        const resposta = await fetch(url);
        // Converte a resposta para JSON.
        const dados = await resposta.json();

        // Verifica se os dados foram recebidos corretamente.
        if (dados?.data?.results) {
          // Atualiza o estado com os personagens e o total de personagens.
          setPersonagens(dados.data.results);
          setTotalPersonagens(dados.data.total);
        } else {
          // Se houver um erro nos dados, exibe no console.
          console.error("Erro ao carregar personagens:", dados);
        }
      } catch (erro) {
        // Captura e exibe qualquer erro que ocorra durante a requisição.
        console.error("Erro na requisição:", erro);
      } finally {
        // Define 'carregando' como false, independentemente do sucesso ou falha da requisição.
        setCarregando(false);
      }
    }

    // Chama a função para buscar os personagens quando o componente é montado ou o 'offset' muda.
    buscarPersonagens();
  }, [offset]); // O efeito é re-executado sempre que o 'offset' muda.

  // ---
  // Este 'useEffect' é acionado sempre que o 'offset' muda. Ele salva a posição atual no armazenamento local.
  useEffect(() => {
    localStorage.setItem(CHAVE_OFFSET_LOCAL_STORAGE, offset.toString());
  }, [offset]); // O efeito é re-executado sempre que o 'offset' muda.

  // ---
  // Função para ir para a próxima página de personagens.
  const proximaPagina = () => {
    // Verifica se ainda há personagens para carregar na próxima página.
    if (offset + LIMITE_POR_PAGINA < totalPersonagens) {
      setOffset(offset + LIMITE_POR_PAGINA); // Incrementa o offset.
    }
  };

  // Função para ir para a página anterior de personagens.
  const paginaAnterior = () => {
    // Verifica se não estamos já na primeira página.
    if (offset - LIMITE_POR_PAGINA >= 0) {
      setOffset(offset - LIMITE_POR_PAGINA); // Decrementa o offset.
    }
  };

  // ---
  // Função que é chamada quando um card de personagem é clicado.
  const lidarComCliqueNoCard = (idPersonagem) => {
    // Navega para a rota de detalhes do personagem, passando o ID.
    navegar(`/personagem/${idPersonagem}`);
  };

  // ---
  // Calcula o número da página atual (adiciona 1 porque o offset começa em 0).
  const paginaAtual = offset / LIMITE_POR_PAGINA + 1;
  // Calcula o número total de páginas, arredondando para cima para incluir páginas parciais.
  const totalPaginas = Math.ceil(totalPersonagens / LIMITE_POR_PAGINA);

  // ---
  // O que será exibido na tela.
  return (
    <>
      {/* Seção de botões de paginação */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        {/* Botão para página anterior. Fica desabilitado na primeira página. */}
        <button onClick={paginaAnterior} disabled={offset === 0} className="pagination-button">
          Página Anterior
        </button>
        {/* Mostra a informação da página atual e total de páginas. */}
        <span style={{ margin: "0 15px" }}>
          Página {paginaAtual} de {totalPaginas}
        </span>
        {/* Botão para próxima página. Fica desabilitado na última página. */}
        <button
          onClick={proximaPagina}
          disabled={offset + LIMITE_POR_PAGINA >= totalPersonagens}
          className="pagination-button"
        >
          Próxima Página
        </button>
      </div>

      {/* Exibição condicional: mostra "Carregando..." ou a lista de personagens. */}
      {carregando ? (
        <p>Carregando personagens...</p>
      ) : (
        // Container para exibir os cards dos personagens.
        <div className="lista-personagens-container">
          {/* Mapeia a lista de personagens para criar um "card" para cada um. */}
          {personagens.map((heroi) => (
            <div
              key={heroi.id} // 'key' é importante para o React renderizar listas eficientemente.
              onClick={() => lidarComCliqueNoCard(heroi.id)} // Adiciona um evento de clique ao card.
              className="personagem-card"
              style={{ cursor: "pointer" }} // Muda o cursor para indicar que é clicável.
            >
              {/* Imagem do personagem. Monta a URL da imagem usando os dados da API. */}
              <img
                src={`${heroi.thumbnail.path}/standard_xlarge.${heroi.thumbnail.extension}`}
                alt={heroi.name}
              />
              {/* Nome do personagem. */}
              <h3>{heroi.name}</h3>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Exporta o componente para que possa ser usado em outras partes da aplicação.
export default ListaPersonagens;