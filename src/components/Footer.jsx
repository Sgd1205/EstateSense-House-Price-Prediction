import { Link } from "react-router-dom";
import "../styles/style.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h3>🏘 EstateSense</h3>
          <p>AI powered property valuation platform for Mumbai real estate.</p>
        </div>

        <div className="footer-links">
          <h4>Navigate</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How it Works</Link>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-links">
          <h4>Tech Stack</h4>
          <span style={{ fontSize: "14px", color: "#6b7280", lineHeight: "2" }}>
            React · Flask · Scikit-learn<br />
            Pandas · SQLite · Vite
          </span>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 EstateSense. Built for educational purposes.</p>
      </div>

    </footer>
  );
}

export default Footer;