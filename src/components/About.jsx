import "../styles/style.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <h1>About EstateSense</h1>
        <p>
          EstateSense is a machine learning powered platform designed to analyze
          Mumbai's housing data and deliver accurate, data-driven property valuations
          — instantly and effortlessly.
        </p>
      </section>

      {/* CARDS */}
      <section className="about-cards">

        <div className="glass-card">
          <span className="card-icon">🎯</span>
          <h3>Our Goal</h3>
          <p>
            To make property valuation accessible to everyone — whether you're a
            buyer, seller, or real estate enthusiast looking for data-backed insights.
          </p>
        </div>

        <div className="glass-card">
          <span className="card-icon">🛠️</span>
          <h3>Technologies</h3>
          <p>
            Built with React, Python Flask, Pandas, Scikit-learn and modern
            data analysis techniques for a seamless full-stack experience.
          </p>
        </div>

        <div className="glass-card">
          <span className="card-icon">🧠</span>
          <h3>Machine Learning</h3>
          <p>
            Random Forest Regressor, Linear Regression and Gradient Boosting
            models power the prediction engine trained on thousands of listings.
          </p>
        </div>

      </section>

      {/* TECH STACK */}
      <section className="about-extra">
        <h2>Built With Modern Tech</h2>
        <p>
          Our stack is designed for performance, reliability and scalability —
          from data processing pipelines to responsive UI.
        </p>
        <div className="tech-badges">
          <span className="tech-badge">⚛️ React 19</span>
          <span className="tech-badge">🐍 Python Flask</span>
          <span className="tech-badge">🤖 Scikit-learn</span>
          <span className="tech-badge">🐼 Pandas</span>
          <span className="tech-badge">⚡ Vite</span>
          <span className="tech-badge">🗄️ SQLite</span>
          <span className="tech-badge">🔑 Flask-Bcrypt</span>
          <span className="tech-badge">📊 Random Forest</span>
        </div>
      </section>

    </div>
  );
}

export default About;