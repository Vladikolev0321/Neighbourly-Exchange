// import { useEffect, useState } from "react";
// import L from "leaflet";
// import type { LinksFunction } from "@remix-run/node";

// // Import Leaflet CSS
// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: "https://unpkg.com/leaflet/dist/leaflet.css" },
// ];


// const NeighborhoodSelection = () => {
//   const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
//     []
//   );

//   useEffect(() => {
//     // Initialize the Leaflet map
//     const map = L.map("map").setView([42.6977, 23.3219], 12); // Coordinates for Sofia
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(map);

//     // Example: Add marker interaction
//     map.on("click", (event) => {
//       const { lat, lng } = event.latlng;
//       const selected = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
//       if (!selectedNeighborhoods.includes(selected)) {
//         setSelectedNeighborhoods([...selectedNeighborhoods, selected]);
//       }
//     });
//   }, [selectedNeighborhoods]);

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value.toLowerCase());
//   };

//   const filterNeighborhoods = neighborhoods.filter((n) =>
//     n.toLowerCase().includes(searchQuery)
//   );

//   const handleSelectNeighborhood = (neighborhood: string) => {
//     if (!selectedNeighborhoods.includes(neighborhood)) {
//       setSelectedNeighborhoods([...selectedNeighborhoods, neighborhood]);
//     }
//   };

//   const removeSelectedNeighborhood = (neighborhood: string) => {
//     setSelectedNeighborhoods(
//       selectedNeighborhoods.filter((n) => n !== neighborhood)
//     );
//   };

//   return (
//     <div className="flex flex-wrap justify-between p-10 gap-8">
//       {/* Neighborhood List Section */}
//       <div className="w-full lg:w-1/3 bg-white p-5 rounded-xl shadow-md">
//         <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
//           Квартали в София
//         </h3>
//         <input
//           type="text"
//           placeholder="Search for a neighborhood..."
//           className="w-full p-3 mb-5 border rounded-lg"
//           value={searchQuery}
//           onChange={handleSearch}
//         />
//         <ul className="h-96 overflow-y-auto space-y-3">
//           {filterNeighborhoods.map((neighborhood) => (
//             <li
//               key={neighborhood}
//               className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white"
//               onClick={() => handleSelectNeighborhood(neighborhood)}
//             >
//               {neighborhood}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Map Section */}
//       <div className="w-full lg:w-1/3 bg-white p-5 rounded-xl shadow-md">
//         <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
//           Кликнете, за да изберете квартал
//         </h3>
//         <div id="map" className="h-96 w-full rounded-xl"></div>
//       </div>

//       {/* Selected Neighborhoods Section */}
//       <div className="w-full lg:w-1/3 bg-white p-5 rounded-xl shadow-md">
//         <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
//           Избрани квартали
//         </h3>
//         <ul className="space-y-3">
//           {selectedNeighborhoods.map((neighborhood) => (
//             <li
//               key={neighborhood}
//               className="flex items-center justify-between p-3 bg-green-500 text-white rounded-lg"
//             >
//               {neighborhood}
//               <button
//                 onClick={() => removeSelectedNeighborhood(neighborhood)}
//                 className="text-lg font-bold hover:text-yellow-300"
//               >
//                 &times;
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NeighborhoodSelection;
