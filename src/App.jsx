import { useState, useEffect } from 'react'
import './App.css'


const names = ['John', 'Jane', 'Jack', 'Jill']

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [sumWeight, setSumWeight] = useState(null); 

  // Fetch all trips data
  useEffect(() => {
    fetch("https://tripapi.cphbusinessapps.dk/api/trips")
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

  // Handle trip selection and fetch sumWeight based on the trip ID
  function handleDetails(trip) {
    setSelectedTrip(trip);
  }

  // Fetch sumWeight based on the selected trip ID
  useEffect(() => {
    if (selectedTrip) {
      fetch("https://tripapi.cphbusinessapps.dk/api/trips/${selectedTrip.id}") // Ensure proper URL format
        .then((response) => response.json())
        .then((data) => {
          let totalWeight = 0;
          // Assuming data is an array with items that have weightInGrams
          data.packingItems.forEach(element => {
            totalWeight += element.weightInGrams;
          });
          setSumWeight(totalWeight);
        })
        .catch((error) => console.error("Error fetching trip details:", error));
    }
  }, [selectedTrip]); // Re-run this effect when selectedTrip changes
return (
    <div>
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">All Categories</option>
        <option value="SNOW">Snow</option>
        <option value="BEACH">Beach</option>
        <option value="LAKE">Lake</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {trips
            .filter((trip) => {
              if (!selectedCategory) return true;
              return trip.category === selectedCategory;
            })
            .map((trip) => (
              <tr key={trip.id}>
                <td>{trip.name}</td>
                <td>{trip.price} kr.</td>
                <td>
                  {new Date(trip.starttime).toLocaleDateString()} -{" "}
                  {new Date(trip.endtime).toLocaleDateString()}
                  <button onClick={() => handleDetails(trip)}>Show Details</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedTrip && (
  <div>
    <h2>Trip Details</h2>
    <ul>
      <li>Name: {selectedTrip.name}</li>
      <li>Price: {selectedTrip.price}</li>
      <li>Guide: {selectedTrip.guide ? selectedTrip.guide.name : "No guide available"}</li> {/* Assuming guide is an object /}
      <li>Category: {selectedTrip.category ? selectedTrip.category.name : "No category available"}</li> {/ Assuming category is an object */}
      <li>Date: {new Date(selectedTrip.starttime).toLocaleDateString()} - {new Date(selectedTrip.endtime).toLocaleDateString()}</li>
      <li>Weight (grams): {sumWeight !== null ? sumWeight : "No items available"}</li>
    </ul>
  </div>
)}

    </div>
  );
}

export default App;