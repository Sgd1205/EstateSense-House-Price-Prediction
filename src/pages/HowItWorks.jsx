import { Link } from "react-router-dom";
import "../styles/style.css";

function HowItWorks() {
    return (
        <div className="how-it-works">
            <div className="container">
                <section className="info-hero">
                    <h1>How Our AI Model Works</h1>
                    <p>Transparent and data-driven property valuation at your fingertips.</p>
                </section>

                <section className="steps">
                    <div className="step-card">
                        <div className="step-num">01</div>
                        <h3>Data Collection</h3>
                        <p>We use historical housing data from Mumbai, including square footage, location coordinates, and property amenities.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-num">02</div>
                        <h3>Feature Engineering</h3>
                        <p>The model analyzes features like BHK, total area, neighborhood popularity, and building age to understand price drivers.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-num">03</div>
                        <h3>ML Prediction</h3>
                        <p>Our Random Forest Regressor processes these features against thousands of data points to generate an accurate price estimate.</p>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="glass-panel">
                        <h2>Ready to value your property?</h2>
                        <p>Join thousands of users who rely on our AI for accurate market estimates.</p>
                        <Link to="/register" className="primary-btn" style={{textDecoration: 'none', display: 'inline-block', marginTop: '20px'}}>
                            Get Started
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default HowItWorks;
