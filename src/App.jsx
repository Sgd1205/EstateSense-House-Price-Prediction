import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import HowItWorks from "./pages/HowItWorks";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/predict" element={<Prediction />} />
      </Routes>

    <Footer/>
    </Router>
  );
}

export default App;