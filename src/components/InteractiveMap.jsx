import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet markers icon issue
import L from 'leaflet';

function InteractiveMap() {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/map_data")
      .then(res => res.json())
      .then(data => {
        setMapData(data);
        setLoading(false);
      })
      .catch(err => console.error("Map fetch error:", err));
  }, []);

  const getMarkerColor = (price) => {
    if (price > 300) return "#ef4444"; // High - Red
    if (price > 150) return "#f59e0b"; // Medium - Orange
    return "#10b981"; // Low - Green
  };

  if (loading) return <div className="loader">Loading Map Data...</div>;

  return (
    <div className="map-wrapper" style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapData.map((pos, idx) => (
          <CircleMarker
            key={idx}
            center={[pos.lat, pos.lng]}
            radius={10}
            pathOptions={{
              fillColor: getMarkerColor(pos.avgPrice),
              color: 'white',
              weight: 2,
              fillOpacity: 0.8
            }}
          >
            <Popup>
              <div style={{ padding: '5px' }}>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{pos.region}</strong>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Premium Pulse: {pos.avgPrice > 200 ? 'High Hotspot' : 'Growth Zone'}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      <div className="map-legend" style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, fontSize: '11px' }}>
         <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
           <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444'}}></div> High Price Zone
         </div>
         <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
           <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f59e0b'}}></div> Mid Range
         </div>
         <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
           <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#10b981'}}></div> Emerging Zone
         </div>
      </div>
    </div>
  );
}

export default InteractiveMap;
