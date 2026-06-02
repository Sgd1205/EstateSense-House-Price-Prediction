import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo" style={{ textDecoration: "none" }}>
        🏘 EstateSense
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {!user && (
          <>
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How it Works</Link>
          </>
        )}
        {user ? (
          <>
            <Link to="/predict">Predict</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="login-btn" style={{cursor: 'pointer'}}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>

    </nav>
  );
}

export default Navbar;