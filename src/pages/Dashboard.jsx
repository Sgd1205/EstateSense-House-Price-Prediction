import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell 
} from "recharts";
import InteractiveMap from "../components/InteractiveMap";
import "../styles/style.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("history"); // "history" or "insights"
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  
  // Selection for comparison
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [histRes, statsRes, recsRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/history/${user.id}`),
        fetch(`http://127.0.0.1:5000/model_stats`),
        fetch(`http://127.0.0.1:5000/api/recommendations/${user.id}`)
      ]);
      
      const histData = await histRes.json();
      const statsData = await statsRes.json();
      const recsData = await recsRes.json();
      
      setHistory(histData);
      setStats(statsData);
      setRecommendations(recsData.recommendations || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await fetch(`http://127.0.0.1:5000/history/${id}`, { method: "DELETE" });
      setHistory(prev => prev.filter(item => item.id !== id));
      setSelectedForCompare(prev => prev.filter(item => item.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const toggleComparison = (item) => {
    if (selectedForCompare.find(s => s.id === item.id)) {
      setSelectedForCompare(selectedForCompare.filter(s => s.id !== item.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, item]);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/history/favorite/${id}`, { method: "POST" });
      const data = await res.json();
      setHistory(history.map(item => item.id === id ? { ...item, is_favorite: data.is_favorite } : item));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const formatPrice = (value) => {
    if (value >= 100) return `₹ ${(value / 100).toFixed(2)} Cr`;
    return `₹ ${value.toFixed(2)} Lakhs`;
  };

  if (!user) {
    return <div className="dashboard-empty">Please login to view your dashboard.</div>;
  }

  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
        <div className="header-info">
          <h1>User Dashboard</h1>
          <p>Welcome back, <strong>{user.name}</strong>. Manage your property searches and model insights.</p>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={activeTab === "history" ? "tab-active" : ""} 
            onClick={() => setActiveTab("history")}
          >
            Prediction History
          </button>
          <button 
            className={activeTab === "insights" ? "tab-active" : ""} 
            onClick={() => setActiveTab("insights")}
          >
            Model Insights
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loader">Loading your dashboard...</div>
      ) : (
        <div className="dashboard-content">
          
          {activeTab === "history" && (
            <>
              {selectedForCompare.length > 0 && (
                <div className="comparison-board animate-fade-in">
                  <div className="comparison-top">
                    <div className="comparison-meta">
                      <h3>Property Comparison</h3>
                      <span className="compare-badge">{selectedForCompare.length} Selected</span>
                    </div>
                    <button className="clear-all-btn" onClick={() => setSelectedForCompare([])}>
                      Clear Selection
                    </button>
                  </div>
                  
                  <div className="comparison-grid-wrapper">
                    <table className="modern-compare-table">
                      <thead>
                        <tr>
                          <th>Specifications</th>
                          {selectedForCompare.map(s => (
                            <th key={s.id}>
                              <div className="compare-location-header">
                                <span className="loc-icon">📍</span>
                                {s.region}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="price-row">
                          <td className="spec-label"><span>💰</span> Price</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val-price">{formatPrice(s.price)}</td>)}
                        </tr>
                        <tr>
                          <td className="spec-label"><span>📏</span> Total Area</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val">{s.area} sqft</td>)}
                        </tr>
                        <tr>
                          <td className="spec-label"><span>🛌</span> Configuration</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val">{s.bhk} BHK</td>)}
                        </tr>
                        <tr>
                          <td className="spec-label"><span>🏠</span> Prop. Type</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val">{s.type}</td>)}
                        </tr>
                        <tr>
                          <td className="spec-label"><span>🔨</span> Status</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val">{s.status}</td>)}
                        </tr>
                        <tr>
                          <td className="spec-label"><span>⏳</span> Age</td>
                          {selectedForCompare.map(s => <td key={s.id} className="spec-val">{s.age}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="history-grid">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div key={item.id} className={`history-card-new ${selectedForCompare.find(s => s.id === item.id) ? 'active-select' : ''}`}>
                      <div className="card-selection-overlay">
                        <input 
                           type="checkbox" 
                           checked={!!selectedForCompare.find(s => s.id === item.id)}
                           onChange={() => toggleComparison(item)}
                           className="hidden-checkbox"
                        />
                        <div className="selection-trigger">
                          {selectedForCompare.find(s => s.id === item.id) ? '✅ Selected' : '+ Compare'}
                        </div>
                      </div>

                      <div className="card-body-new">
                        <div className="card-top-row">
                          <span className="timestamp-tiny">{item.timestamp}</span>
                          <button 
                            className={`fav-heart ${item.is_favorite ? "is-fav" : ""}`}
                            onClick={() => toggleFavorite(item.id)}
                          >
                            {item.is_favorite ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <h3>{item.region}</h3>
                        <p className="card-sub-info">{item.bhk} BHK • {item.type}</p>
                        <div className="card-price-tag">{formatPrice(item.price)}</div>
                        
                        <div className="card-actions-row">
                           <button className="mini-del-btn" onClick={(e) => handleDelete(e, item.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-msg">No predictions yet. Let's start searching!</div>
                )}
              </div>
            </>
          )}

          {activeTab === "insights" && stats && (
            <div className="insights-view">
              
              <div className="recs-section">
                <h3>Recommended Regions for You</h3>
                <div className="recs-grid">
                  {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                    <div key={idx} className="rec-card">
                       <span className="rec-label">💡 Suggested</span>
                       <span className="rec-name">{rec}</span>
                    </div>
                  )) : (
                    <p className="no-recs">Make more predictions to unlock personalized suggestions.</p>
                  )}
                </div>
              </div>

              <div className="map-section">
                <h3>Mumbai Real Estate Heatmap</h3>
                <p className="section-subtitle">Real-time geographic pricing clusters across the MMR region.</p>
                <InteractiveMap />
              </div>

              <div className="insights-dashboard">
                <div className="insights-chart-card">
                  <h3>Price Determination Factors</h3>
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={stats.feature_importance} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="feature" type="category" width={80} style={{ fontSize: '12px', fontWeight:600 }} />
                        <Tooltip 
                           cursor={{fill: 'rgba(74, 51, 95, 0.05)'}}
                           contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 20px rgba(0,0,0,0.1)'}}
                        />
                        <Bar dataKey="importance" fill="url(#colorBar)" radius={[0, 6, 6, 0]}>
                           <defs>
                             <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                               <stop offset="0%" stopColor="#4a335f" />
                               <stop offset="100%" stopColor="#c2838c" />
                             </linearGradient>
                           </defs>
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="insights-stats-column">
                  <div className="mini-stat-box">
                    <label>R² Confidence</label>
                    <div className="stat-val">{stats.metrics.r2_score}</div>
                  </div>
                  <div className="mini-stat-box">
                    <label>Mean Abs Error</label>
                    <div className="stat-val">{stats.metrics.mae}</div>
                  </div>
                  <div className="mini-stat-box accent">
                    <label>Hotness Index</label>
                    <div className="stat-val">Rising ↑</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      <style>{`
        .dashboard-container { padding: 40px 60px; min-height: 90vh; background: #fbfbfc; font-family: 'Outfit', sans-serif; }
        .dashboard-header { margin-bottom: 40px; }
        .header-info h1 { font-size: 34px; color: #1a1a1a; font-weight: 800; margin-bottom: 5px; }
        .header-info p { color: #888; font-size: 16px; }
        
        .dashboard-tabs { display: inline-flex; gap: 5px; background: #f1f1f1; padding: 6px; border-radius: 14px; margin-top: 20px; }
        .dashboard-tabs button { padding: 12px 24px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; color: #666; background: transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .dashboard-tabs .tab-active { background: white; color: #4a335f; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        
        /* ⚖️ Comparison UI */
        .comparison-board { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border-radius: 24px; padding: 30px; margin-bottom: 40px; border: 1px solid rgba(74, 51, 95, 0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
        .comparison-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .comparison-meta h3 { font-size: 24px; color: #3b2550; font-weight: 800; }
        .compare-badge { background: #4a335f; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 10px; vertical-align: middle; }
        .clear-all-btn { background: #fecaca; color: #ef4444; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .clear-all-btn:hover { background: #fee2e2; transform: scale(1.02); }

        .modern-compare-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .modern-compare-table th { padding: 15px 20px; text-align: left; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
        .modern-compare-table td { padding: 20px; background: rgba(255, 255, 255, 0.5); border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1; }
        .modern-compare-table td:first-child { border-radius: 15px 0 0 15px; border-left: 1px solid #f1f1f1; font-weight: 600; color: #666; width: 180px; }
        .modern-compare-table td:last-child { border-radius: 0 15px 15px 0; border-right: 1px solid #f1f1f1; }
        .compare-location-header { color: #1a1a1a; font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 8px; }
        .price-row td { background: #fdfbff !important; border-top: 2px solid #edebf0 !important; border-bottom: 2px solid #edebf0 !important; }
        .spec-label { display: flex; align-items: center; gap: 10px; }
        .spec-val-price { font-size: 20px; font-weight: 900; color: #4a335f; }
        .spec-val { color: #1a1a1a; font-weight: 700; font-size: 14px; }

        /* 🗃️ Card Overhaul */
        .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .history-card-new { background: white; border-radius: 20px; border: 1px solid #f1f1f1; overflow: hidden; position: relative; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .history-card-new:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        .history-card-new.active-select { border: 2px solid #4a335f; background: #fdfbff; }
        
        .card-selection-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(74, 51, 95, 0); z-index: 5; display: flex; justify-content: center; align-items: center; transition: 0.3s; opacity: 0; }
        .history-card-new:hover .card-selection-overlay { opacity: 1; background: rgba(255, 255, 255, 0.4); }
        .history-card-new.active-select .card-selection-overlay { opacity: 1; background: rgba(74, 51, 95, 0.03); }
        
        .hidden-checkbox { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10; }
        .selection-trigger { background: #4a335f; color: white; padding: 10px 24px; border-radius: 30px; font-weight: 700; font-size: 13px; transform: translateY(10px); transition: 0.3s; box-shadow: 0 10px 20px rgba(74, 51, 95, 0.2); }
        .history-card-new:hover .selection-trigger { transform: translateY(0); }
        .active-select .selection-trigger { background: #10b981; transform: translateY(0); }

        .card-body-new { padding: 25px; }
        .card-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .timestamp-tiny { font-size: 10px; color: #bbb; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }
        .fav-heart { background: none; border: none; font-size: 20px; cursor: pointer; padding: 0; transition: 0.2s; z-index: 6; position: relative; }
        .fav-heart:hover { transform: scale(1.2); }
        
        .card-body-new h3 { font-size: 20px; color: #1a1a1a; margin-bottom: 5px; font-weight: 800; }
        .card-sub-info { font-size: 13px; color: #999; margin-bottom: 15px; font-weight: 600; }
        .card-price-tag { font-size: 22px; font-weight: 900; color: #4a335f; margin-bottom: 20px; }
        
        .card-actions-row { display: flex; justify-content: flex-end; }
        .mini-del-btn { background: none; border: none; color: #ff9494; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: 0.2s; position: relative; z-index: 6; }
        .mini-del-btn:hover { color: #ef4444; }

        /* 💡 Insights Tab */
        .insights-view { display: flex; flex-direction: column; gap: 50px; }
        .recs-section h3 { margin-bottom: 20px; color: #1a1a1a; }
        .recs-grid { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; }
        .rec-card { min-width: 200px; flex: 1; padding: 20px; border-radius: 20px; background: white; border: 1px solid #f1f1f1; display: flex; flex-direction: column; transition: 0.3s; }
        .rec-card:hover { transform: translateY(-5px); border-color: #4a335f; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .rec-label { font-size: 10px; font-weight: 800; color: #4a335f; text-transform: uppercase; margin-bottom: 8px; }
        .rec-name { font-size: 16px; font-weight: 800; color: #333; }

        .map-section h3 { margin-bottom: 10px; font-weight: 800; }
        .section-subtitle { color: #999; font-size: 14px; margin-bottom: 25px; }

        .insights-dashboard { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
        .insights-chart-card { background: white; border-radius: 24px; padding: 30px; border: 1px solid #f1f1f1; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .insights-chart-card h3 { margin-bottom: 30px; font-size: 18px; color: #1a1a1a; }
        
        .insights-stats-column { display: flex; flex-direction: column; gap: 15px; }
        .mini-stat-box { background: white; padding: 25px; border-radius: 24px; border: 1px solid #f1f1f1; display: flex; flex-direction: column; gap: 5px; }
        .mini-stat-box label { font-size: 12px; color: #bbb; text-transform: uppercase; font-weight: 800; }
        .stat-val { font-size: 26px; font-weight: 900; color: #1a1a1a; }
        .mini-stat-box.accent { background: #4a335f; color: white !important; }
        .mini-stat-box.accent label { color: rgba(255,255,255,0.5); }
        .mini-stat-box.accent .stat-val { color: white; }

        .loader { text-align: center; padding: 100px; font-weight: 800; color: #4a335f; letter-spacing: 2px; }
        .animate-fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
          .insights-dashboard { grid-template-columns: 1fr; }
          .dashboard-container { padding: 40px 20px; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;