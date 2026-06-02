import { Link } from "react-router-dom";
import "../styles/style.css";

function Home() {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-center">
            <div className="hero-badge">🏠 Mumbai Real Estate AI</div>

            <h1>
              Predict Property Prices with <span>AI Precision</span>
            </h1>

            <p>
              Analyze housing data and instantly estimate property values using
              machine learning models trained on 10,000+ Mumbai real estate listings.
            </p>

            <div className="hero-buttons">
              <Link to="/how-it-works" className="primary-btn" style={{ textDecoration: "none" }}>
                Start Prediction →
              </Link>
              <Link to="/about" className="secondary-btn" style={{ textDecoration: "none" }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR (Moved outside hero viewport to be scrollable) */}
      <section className="hero-stats-section">
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Listings Trained</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">92%</div>
            <div className="stat-label">Model Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Mumbai Locations</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="glass-card">
          <span className="card-icon">📊</span>
          <h3>Smart Data Analysis</h3>
          <p>
            Analyze real Mumbai housing datasets to uncover pricing trends
            across neighborhoods, BHK types, and property ages.
          </p>
        </div>

        <div className="glass-card">
          <span className="card-icon">🤖</span>
          <h3>Machine Learning Models</h3>
          <p>
            Powered by Random Forest, Linear Regression, and Gradient Boosting
            for highly accurate and reliable predictions.
          </p>
        </div>

        <div className="glass-card">
          <span className="card-icon">⚡</span>
          <h3>Instant Valuation</h3>
          <p>
            Get a property price estimate in seconds based on location, size,
            BHK, type, status, and building age.
          </p>
        </div>
      </section>

    </div>
  );
}

export default Home;