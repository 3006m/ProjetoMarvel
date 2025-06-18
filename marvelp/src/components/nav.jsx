import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav style={{
      display: "flex",
      gap: "2em",
      alignItems: "center",
      padding: "1em",
      background: "#222",
      color: "#fff"
    }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
        Home
      </Link>
      <Link to="/favoritos" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
        Favoritos ❤️
      </Link>
    </nav>
  );
}

export default Nav;