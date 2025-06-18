import { useState } from 'react';

// Componente funcional BotaoLike (Favoritar)
function BotaoLike({ id }) {
    // Estado para armazenar se está favoritado
    const [favorito, setFavorito] = useState(() => {
        const salvo = localStorage.getItem(`${id}`);
        return salvo ? JSON.parse(salvo) : false;
    });

    // Função chamada ao clicar no coração
    const handleClick = () => {
        const novoFavorito = !favorito;
        setFavorito(novoFavorito);
        localStorage.setItem(`${id}`, JSON.stringify(novoFavorito));
    };

    return (
        <button
            onClick={handleClick}
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "2em",
                color: favorito ? "red" : "gray",
                transition: "color 0.2s"
            }}
           
        >
            {favorito ? "❤️" : "🤍"}
        </button>
    );
}

export default BotaoLike;