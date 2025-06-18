import { useEffect, useState } from "react";
import md5 from "blueimp-md5";

const CHAVE_PUBLICA = "f207163107199ed0a29dea5edac0aafd";
const CHAVE_PRIVADA = "28fa8b1b48a30973e84405ee9c5efea4157a8fa6";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarFavoritos() {
      setCarregando(true);

      //variavel que pega os ids dos favoritos do localStorage
      const favoritosIds = Object.keys(localStorage)
        .filter((key) => localStorage.getItem(key) === "true");

      if (favoritosIds.length === 0) {
        setFavoritos([]);
        setCarregando(false);
        return;
      }

      // busca na api os heróis
      const ts = Date.now().toString();
      const hash = md5(ts + CHAVE_PRIVADA + CHAVE_PUBLICA);
      const url = `https://gateway.marvel.com/v1/public/characters?limit=100&ts=${ts}&apikey=${CHAVE_PUBLICA}&hash=${hash}`;

      try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const todos = dados?.data?.results || [];

        //filtra os heróis favoritos
        const favoritosSelecionados = todos.filter((heroi) =>
          favoritosIds.includes(String(heroi.id))
        );
        setFavoritos(favoritosSelecionados);
      } catch {
        setFavoritos([]);
      } finally {
        setCarregando(false);
      }
    }

    buscarFavoritos();
  }, []);

  return (
    <div>
      <h1>Heróis Favoritos</h1>
      {carregando ? (
        <p>Carregando...</p>
      ) : favoritos.length === 0 ? (
        <p>Nenhum herói favoritado.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {favoritos.map((heroi) => (
            <div
              key={heroi.id}
              style={{
                border: "1px solid #eee",
                padding: 16,
                width: 180,
                textAlign: "center",
              }}
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
      )}
    </div>
  );
}

export default Favoritos;