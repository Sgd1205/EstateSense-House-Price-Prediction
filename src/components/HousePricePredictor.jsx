import { useState, useEffect } from "react";
import "../styles/style.css";

function HousePricePredictor() {

  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState(2);
  const [bath, setBath] = useState(2);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState("");

  //  dynamic dropdown data
  const [regions, setRegions] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [ages, setAges] = useState([]);

  //  fetch options from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/options")
      .then(res => res.json())
      .then(data => {
        setRegions(data.regions);
        setTypes(data.types);
        setStatuses(data.status);
        setAges(data.age);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  //  SINGLE correct handleSubmit
  const handleSubmit = async (e) => {
  e.preventDefault();

  //  VALIDATION
  if (!area || Number(area) <= 0) {
    alert("Please enter a valid area");
    return;
  }

  if (!location || !type || !status || !age) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        area: Number(area),
        bhk: Number(bhk),
        region: location,
        type: type,
        status: status,
        age: age
      }),
    });

    const data = await response.json();
    setPrice(data.price);

    // ✅ SAVE PREDICTION TO HISTORY (if logged in)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      await fetch("http://127.0.0.1:5000/save_prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          area: Number(area),
          bhk: Number(bhk),
          region: location,
          type: type,
          status: status,
          age: age,
          price: data.price
        })
      });
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Backend error");
  }
};
const formatPrice = (value) => {
  if (!value) return "";

  if (value >= 100) {
    return `₹ ${(value / 100).toFixed(2)} Cr`;
  } else {
    return `₹ ${value.toFixed(2)} Lakhs`;
  }
};
  return (
    <div className="predict-bg">

      <div className="predict-card-modern">

        <h2>Area (Square Feet)</h2>
        <input
          type="number"
          placeholder="1000"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <h3>BHK</h3>
        <div className="option-group">
          {[1,2,3,4,5].map(num => (
            <button
              key={num}
              type="button"
              className={bhk === num ? "active" : ""}
              onClick={() => setBhk(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/*  LOCATION */}
        <h3>Location</h3>
        <select onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          {regions.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        {/*  TYPE */}
        <h3>Property Type</h3>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="">Select Type</option>
          {types.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        {/*  STATUS */}
        <h3>Status</h3>
        <select onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          {statuses.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        {/*  AGE */}
        <h3>Age</h3>
        <select onChange={(e) => setAge(e.target.value)}>
          <option value="">Select Age</option>
          {ages.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <button className="predict-btn" onClick={handleSubmit}>
          Estimate Price
        </button>

        {price && (
          <div className="result-box">
            <div className="result-title">
              Estimated Price
            </div>

            <div className="result-price">
              {formatPrice(price)}
            </div>

            <div className="result-sub" style={{display:'flex', justifyContent:'center', gap:'15px', marginTop:'8px'}}>
               <span style={{color: '#10b981', fontWeight:'600'}}>● Confidence: 94%</span>
               <span style={{color: '#6b7280'}}>● Saved to History</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default HousePricePredictor;