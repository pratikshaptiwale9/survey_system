import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const markers = [
  { name: "USA", coordinates: [-100, 40], status: "Satisfied" },
  { name: "Brazil", coordinates: [-50, -15], status: "Neutral" },
  { name: "India", coordinates: [78, 22], status: "Very Satisfied" },
  { name: "Australia", coordinates: [133, -25], status: "Dissatisfied" },
  { name: "Russia", coordinates: [100, 60], status: "Very Dissatisfied" },
];

const statusColors = {
  "Very Satisfied": "#3B82F6",
  Satisfied: "#10B981",
  Neutral: "#F59E0B",
  Dissatisfied: "#EF4444",
  "Very Dissatisfied": "#991B1B",
};

const Analysis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Survey Data Analysis
          </h1>
          <p className="text-gray-600">
            Visualize survey responses across different locations to identify
            trends and areas for improvement.
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Interactive Map Overview
          </h2>

          <div className="relative">
            <ComposableMap
              projectionConfig={{
                scale: 140,
              }}
              width={800}
              height={400}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E5E7EB"
                      stroke="#D1D5DB"
                    />
                  ))
                }
              </Geographies>

              {markers.map(({ name, coordinates, status }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle
                    r={10}
                    fill={statusColors[status]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    y={4}
                    fontSize={10}
                    fill="#fff"
                    className="font-semibold"
                  >
                    {status[0]}
                  </text>
                </Marker>
              ))}
            </ComposableMap>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
              <h3 className="text-sm font-semibold mb-2">Legend</h3>
              <ul className="space-y-1 text-sm">
                {Object.keys(statusColors).map((key) => (
                  <li key={key} className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[key] }}
                    ></span>
                    <span>{key}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;