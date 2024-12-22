// import { useState } from "react";

// interface Neighborhood {
//   id: number;
//   name: string;
// }

// const neighborhoods: Neighborhood[] = [
//     { id: 1, name: "Сердика" },
//     { id: 2, name: "Зона Б-5" },
//     {id: 3, name: "Зона Б-18"},
//     {id: 4, name: "Зона Б-19"},
//     {id: 5, name: "Зона Б-5Сердика-3"},
//     {id: 6, name: "Възраждане"},
//     {id: 7, name: "Дианабад"},
//     {id: 8, name: "Изгрев"},
//     {id: 9, name: "Изток"},
//     {id: 10, name: "Гевгелийски"},
//     {id: 11, name: "Захарна фабрика"},
//     {id: 12, name: "Илинден"},
//     {id: 13, name: "Света Троица"},
//     {id: 14, name: "Долни Смърдан"},
//     {id: 15, name: "Западен парк"},
//     {id: 16, name: "Красна поляна - 1"},
//     {id: 17, name: "Красна поляна -2"},
//     {id: 18, name: "Красна поляна - 3"},
//     {id: 19, name: "Разсадника"},
//     {id: 20, name: "Факултета"},
//     {id: 21, name: "в.з. Смърдана"},
//     {id: 22, name: "Белите брези"},
//     {id: 23, name: "Борово"},
//     {id: 24, name: "Красно село"},
//     {id: 25, name: "Крива река"},
//     {id: 26, name: "Лагера"},
//     {id: 27, name: "Славия"},
//     {id: 28, name: "Хиподрума"},
//     {id: 29, name: "Сердика"},
//     {id: 30, name: "Петте кьошета"},
//     {id: 31, name: "Бъкстон"},
//     {id: 32, name: "Люлин 1"},
//     {id: 33, name: "Люлин 2"},
//     {id: 34, name: "Люлин 3"},
//     {id: 35, name: "Люлин 4"},
//     {id: 36, name: "Люлин 5"},
//     {id: 37, name: "Люлин 6"},
//     {id: 38, name: "Люлин 7"},
//     {id: 39, name: "Люлин 8"},
//     {id: 40, name: "Люлин 9"},
//     {id: 41, name: "Люлин 10"},
//     {id: 42, name: "Република"},
//     {id: 43, name: "Филиповци"},
//     {id: 44, name: "в.з. Малинов дол"},
//     {id: 45, name: "Лозенец"},
//     {id: 46, name: "Витоша"},
//     {id: 47, name: "Градина"},
//     {id: 48, name: "Кръстова вада - изток"},
//     {id: 49, name: "Хладилника"},
//     {id: 50, name: "Зоопарк"},
//     {id: 51, name: "Младост 1"},
//     {id: 52, name: "Младост 1 А"},
//     {id: 53, name: "Младост 2"},
//     {id: 54, name: "Младост 3"},
//     {id: 55, name: "Младост 4"},
//     {id: 56, name: "Полигона"},
//     {id: 57, name: "11-ти километър"},
//     {id: 58, name: "Горубляне"},
//     {id: 59, name: "Експериментален"},
//     {id: 60, name: "7-ми километър"},
//     {id: 61, name: "в.з. Американски колеж"},
//     {id: 62, name: "Триъгълника"},
//     {id: 63, name: "Лев Толстой"},
//     {id: 64, name: "Надежда 1"},
//     {id: 65, name: "Надежда 3"},
//     {id: 66, name: "Надежда 4"},
//     {id: 67, name: "Надежда 2"},
//     {id: 68, name: "Свобода"},
//     {id: 69, name: "Илиянци"},
//     {id: 70, name: "Требич"},
//     {id: 71, name: "Подуяне"},
//     {id: 72, name: "Оборище"},
//     {id: 73, name: "Център Сточна гара"},
//     {id: 74, name: "Център Оборище"},
//     {id: 75, name: "Васил Левски"},
//     {id: 76, name: "Стефан Караджа"},
//     {id: 77, name: "Сухата река"},
//     {id: 78, name: "Левски - В"},
//     {id: 79, name: "Левски - Г"},
//     {id: 80, name: "Малашевци"},
//     {id: 81, name: "Хаджи Димитър"},
//     {id: 82, name: "Банишора"},
//     {id: 83, name: "Централна гара"},
//     {id: 84, name: "Орландовци"},
//     {id: 85, name: "Бенковски"},
//     {id: 86, name: "Фондови жилища"},
//     {id: 87, name: "Христо Ботев"},
//     {id: 88, name: "Гео Милев"},
//     {id: 89, name: "Подуяне"},
//     {id: 90, name: "Христо Смирненски"},
//     {id: 91, name: "Яворов (Слатина)"},
//     {id: 92, name: "БАН 4-ти км"},
//     {id: 93, name: "Дървеница"},
//     {id: 94, name: "Студентски град"},
//     {id: 95, name: "Мусагеница"},
//     {id: 96, name: "Малинова долина"},
//     {id: 97, name: "Яворов"},
//     {id: 98, name: "Център"},
//     {id: 99, name: "Център"},
//     {id: 100, name: "Манастирски ливади"},
//     {id: 101, name: "Манастирски ливади - Б"},
//     {id: 102, name: "Мотописта"},
//     {id: 103, name: "Гоце Делчев"},
//     {id: 104, name: "Кръстова вада - запад"},
//     {id: 105, name: "Стрелбище"},
//     {id: 106, name: "Иван Вазов"},
//     {id: 107, name: "Южен парк"},
//     {id: 108, name: "Симеоново"},
//     {id: 109, name: "Драгалевци"},
//     {id: 110, name: "Киноцентъра"},
//     {id: 111, name: "Павлово"},
//     {id: 112, name: "Бъкстон"},
//     {id: 113, name: "Бояна"},
//     {id: 114, name: "Карпузица"},
//     {id: 115, name: "София парк"},
//     {id: 116, name: "Княжево"},
//     {id: 117, name: "Владая"},
//     {id: 118, name: "Мърчаево"},
//     {id: 119, name: "Камбаните"},
//     {id: 120, name: "в.з. Малинова долина"},
//     {id: 121, name: "в.з. Черният кос"},
//     {id: 122, name: "Св. Магдалена"},
//     {id: 123, name: "Модерно предградие"},
//     {id: 124, name: "Обеля"},
//     {id: 125, name: "Връбница -1"},
//     {id: 126, name: "Връбница -2"},
//     {id: 127, name: "Обеля -1"},
//     {id: 128, name: "Обеля - 2"},
//     {id: 129, name: "Република 2"},
//     {id: 130, name: "Толева махала"},
//     {id: 131, name: "Волуяк"},
//     {id: 132, name: "Мрамор"},
//     {id: 133, name: "Дружба 1"},
//     {id: 134, name: "Димитър Миленков"},
//     {id: 135, name: "Дружба 2"},
//     {id: 136, name: "Абдовица"},
//     {id: 137, name: "Гара Искър"},
//     {id: 138, name: "Бусманци"},
//     {id: 139, name: "Кремиковци"},
//     {id: 140, name: "Сеславци"},
//     {id: 141, name: "Ботунец"},
//     {id: 142, name: "Челопечене"},
//     {id: 143, name: "Враждебна"},
//     {id: 144, name: "Бухово"},
//     {id: 145, name: "Желява"},
//     {id: 146, name: "Яна"},
//     {id: 147, name: "Горни Богров"},
//     {id: 148, name: "Долни Богров"},
//     {id: 149, name: "Батареята"},
//     {id: 150, name: "Овча Купел"},
//     {id: 151, name: "Овча купел 2"},
//     {id: 152, name: "Овча купел 1"},
//     {id: 153, name: "Горна Баня"},
//     {id: 154, name: "Суходол"},
//     {id: 155, name: "Мало Бучино"},
//     {id: 156, name: "в.з. Бонсови поляни"},
//     {id: 157, name: "Банкя"},
//     {id: 158, name: "Банкя - кв. Вердикал"},
//     {id: 159, name: "Банкя - кв. Градоман"},
//     {id: 160, name: "Банкя- кв. Изгрев"},
//     {id: 161, name: "Банкя - кв. Михайлово"},
//     {id: 162, name: "Клисура"},
//     {id: 163, name: "Клисура - мах. Витковица"},
//     {id: 164, name: "Клисура - Радова мах."},
//     {id: 165, name: "Иваняне"},
//     {id: 166, name: "в.з. Лагера"},
//     {id: 167, name: "в.з. Банкя"},
//     {id: 168, name: "в.з. Бели брег"},
//     {id: 169, name: "Нови Искър - кв. Гниляне"},
//     {id: 170, name: "Нови Искър - кв. Изгрев"},
//     {id: 171, name: "Нови Искър - кв. Кумарица"},
//     {id: 172, name: "Нови Искър - кв. Курило"},
//     {id: 173, name: "Нови Искър - кв. Славовица"},
//     {id: 174, name: "Балша"},
//     {id: 175, name: "Кътина"},
//     {id: 176, name: "Житен"},
//     {id: 177, name: "Войнеговци"},
//     {id: 178, name: "Мировяне"},
//     {id: 179, name: "Доброславци"},
//     {id: 180, name: "Подгумер"},
//     {id: 181, name: "Локорско"},
//     {id: 182, name: "Чепинци"},
//     {id: 183, name: "Негован"},
//     {id: 184, name: "Световрачене"},
//     {id: 185, name: "Кубратово"},
//     {id: 186, name: "Япаджа"},
//     {id: 187, name: "Нови Искър - в.з. Ласка"},
//     {id: 188, name: "Бистрица"},
//     {id: 189, name: "Панчарево"},
//     {id: 190, name: "Железница"},
//     {id: 191, name: "Герман"},
//     {id: 192, name: "Казичене"},
//     {id: 193, name: "Лозен - Долни"},
//     {id: 194, name: "Лозен-Горни"},
//     {id: 195, name: "Кривина"},
//     {id: 196, name: "Долни Пасарел"},
//     {id: 197, name: "Плана"},
//     {id: 198, name: "Кокаляне"},
//     {id: 199, name: "Малинова долина- Герена"},
//     {id: 200, name: "Бункера"},
//     {id: 201, name: "в.з. Лозен"},
//     {id: 202, name: "ПЗ Илиянци"},
//     {id: 203, name: "Индустриална зона"},
//     {id: 204, name: "МК Кремиковци"},
//     {id: 205, name: "Летище София"},
//     {id: 206, name: "Пречиствателна станция"},
//     {id: 207, name: "НПЗ Средец"},
//     {id: 208, name: "СПЗ Модерно предградие"},
//     {id: 209, name: "ПЗ Хладилника"},
//     {id: 210, name: "НПЗ Изток"},
//     {id: 211, name: "ПЗ Илиянци"},
//     {id: 212, name: "ПЗ Хладилен завод"},
//     { id: 213, name: "СПЗ Слатина" },
// ];

// export default function NeighborhoodMap() {
//   const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Set<number>>(new Set());

//   const sortedNeighborhoods = [...neighborhoods].sort((a, b) => a.name.localeCompare(b.name));

//   const toggleNeighborhood = (id: number) => {
//     setSelectedNeighborhoods((prevSelected) => {
//       const newSet = new Set(prevSelected);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <div className="flex">
//       {/* Neighborhood List */}
//       <div className="w-1/3 overflow-y-auto bg-gray-100 p-4">
//         <ul>
//           {sortedNeighborhoods.map((ngb) => (
//             <li
//               key={ngb.id}
//               className={`p-2 cursor-pointer rounded-md mb-2 transition-colors \
//                           ${selectedNeighborhoods.has(ngb.id) ? "bg-blue-200" : "hover:bg-blue-100"}`}
//               onClick={() => toggleNeighborhood(ngb.id)}
//             >
//               {ngb.name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Map Container */}
//       <div id="map" className="w-2/3 h-screen"></div>
//     </div>
//   );
// }

// // To initialize Leaflet map and polygons, include the following code in a useEffect hook or equivalent
// import { useEffect } from "react";
// import L from "leaflet";

// useEffect(() => {
//   const map = L.map("map").setView([42.6977, 23.3219], 12);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "&copy; OpenStreetMap contributors",
//   }).addTo(map);

//   // Example: Store polygons in a Map instead of a plain object
//   const neighborhoodPolygons: Map<number, L.Polygon> = new Map();

//   neighborhoods.forEach((ngb) => {
//     const polygon = L.polygon([[42.6977, 23.3219]], { color: "blue" }).addTo(map); // Adjust coordinates per neighborhood
//     neighborhoodPolygons.set(ngb.id, polygon);
//   });

//   return () => {
//     map.remove();
//   };
// }, []);
