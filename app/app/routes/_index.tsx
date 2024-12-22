import { useEffect, useState } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import neighborhoods from "../utils/neighborhoods.json";
import MapComponent from "../components/map.client";
import Navbar from "../components/navbar";



const neighborhoodsNames = [
  { "id": 1, "name": "Сердика" },
  { "id": 2, "name": "Зона Б-5" },
  { "id": 3, "name": "Зона Б-18" },
  { "id": 4, "name": "Зона Б-19" },
  { "id": 5, "name": "Зона Б-5Сердика-3" },
  { "id": 6, "name": "Възраждане" },
  { "id": 7, "name": "Дианабад" },
  { "id": 8, "name": "Изгрев" },
  { "id": 9, "name": "Изток" },
  { "id": 10, "name": "Гевгелийски" },
  { "id": 11, "name": "Захарна фабрика" },
  { "id": 12, "name": "Илинден" },
  { "id": 13, "name": "Света Троица" },
  { "id": 14, "name": "Долни Смърдан" },
  { "id": 15, "name": "Западен парк" },
  { "id": 16, "name": "Красна поляна - 1" },
  { "id": 17, "name": "Красна поляна -2" },
  { "id": 18, "name": "Красна поляна - 3" },
  { "id": 19, "name": "Разсадника" },
  { "id": 20, "name": "Факултета" },
  { "id": 21, "name": "в.з. Смърдана" },
  { "id": 22, "name": "Белите брези" },
  { "id": 23, "name": "Борово" },
  { "id": 24, "name": "Красно село" },
  { "id": 25, "name": "Крива река" },
  { "id": 26, "name": "Лагера" },
  { "id": 27, "name": "Славия" },
  { "id": 28, "name": "Хиподрума" },
  { "id": 29, "name": "Сердика" },
  { "id": 30, "name": "Петте кьошета" },
  { "id": 31, "name": "Бъкстон" },
  { "id": 32, "name": "Люлин 1" },
  { "id": 33, "name": "Люлин 2" },
  { "id": 34, "name": "Люлин 3" },
  { "id": 35, "name": "Люлин 4" },
  { "id": 36, "name": "Люлин 5" },
  { "id": 37, "name": "Люлин 6" },
  { "id": 38, "name": "Люлин 7" },
  { "id": 39, "name": "Люлин 8" },
  { "id": 40, "name": "Люлин 9" },
  { "id": 41, "name": "Люлин 10" },
  { "id": 42, "name": "Република" },
  { "id": 43, "name": "Филиповци" },
  { "id": 44, "name": "в.з. Малинов дол" },
  { "id": 45, "name": "Лозенец" },
  { "id": 46, "name": "Витоша" },
  { "id": 47, "name": "Градина" },
  { "id": 48, "name": "Кръстова вада - изток" },
  { "id": 49, "name": "Хладилника" },
  { "id": 50, "name": "Зоопарк" },
  { "id": 51, "name": "Младост 1" },
  { "id": 52, "name": "Младост 1 А" },
  { "id": 53, "name": "Младост 2" },
  { "id": 54, "name": "Младост 3" },
  { "id": 55, "name": "Младост 4" },
  { "id": 56, "name": "Полигона" },
  { "id": 57, "name": "11-ти километър" },
  { "id": 58, "name": "Горубляне" },
  { "id": 59, "name": "Експериментален" },
  { "id": 60, "name": "7-ми километър" },
  { "id": 61, "name": "в.з. Американски колеж" },
  { "id": 62, "name": "Триъгълника" },
  { "id": 63, "name": "Лев Толстой" },
  { "id": 64, "name": "Надежда 1" },
  { "id": 65, "name": "Надежда 3" },
  { "id": 66, "name": "Надежда 4" },
  { "id": 67, "name": "Надежда 2" },
  { "id": 68, "name": "Свобода" },
  { "id": 69, "name": "Илиянци" },
  { "id": 70, "name": "Требич" },
  { "id": 71, "name": "Подуяне" },
  { "id": 72, "name": "Оборище" },
  { "id": 73, "name": "Център Сточна гара" },
  { "id": 74, "name": "Център Оборище" },
  { "id": 75, "name": "Васил Левски" },
  { "id": 76, "name": "Стефан Караджа" },
  { "id": 77, "name": "Сухата река" },
  { "id": 78, "name": "Левски - В" },
  { "id": 79, "name": "Левски - Г" },
  { "id": 80, "name": "Малашевци" },
  { "id": 81, "name": "Хаджи Димитър" },
  { "id": 82, "name": "Банишора" },
  { "id": 83, "name": "Централна гара" },
  { "id": 84, "name": "Орландовци" },
  { "id": 85, "name": "Бенковски" },
  { "id": 86, "name": "Фондови жилища" },
  { "id": 87, "name": "Христо Ботев" },
  { "id": 88, "name": "Гео Милев" },
  { "id": 89, "name": "Подуяне" },
  { "id": 90, "name": "Христо Смирненски" },
  { "id": 91, "name": "Яворов (Слатина)" },
  { "id": 92, "name": "БАН 4-ти км" },
  { "id": 93, "name": "Дървеница" },
  { "id": 94, "name": "Студентски град" },
  { "id": 95, "name": "Мусагеница" },
  { "id": 96, "name": "Малинова долина" },
  { "id": 97, "name": "Яворов" },
  { "id": 98, "name": "Център" },
  { "id": 99, "name": "Център" },
  { "id": 100, "name": "Манастирски ливади" },
  { "id": 101, "name": "Манастирски ливади - Б" },
  { "id": 102, "name": "Мотописта" },
  { "id": 103, "name": "Гоце Делчев" },
  { "id": 104, "name": "Кръстова вада - запад" },
  { "id": 105, "name": "Стрелбище" },
  { "id": 106, "name": "Иван Вазов" },
  { "id": 107, "name": "Южен парк" },
  { "id": 108, "name": "Симеоново" },
  { "id": 109, "name": "Драгалевци" },
  { "id": 110, "name": "Киноцентъра" },
  { "id": 111, "name": "Павлово" },
  { "id": 112, "name": "Бъкстон" },
  { "id": 113, "name": "Бояна" },
  { "id": 114, "name": "Карпузица" },
  { "id": 115, "name": "София парк" },
  { "id": 116, "name": "Княжево" },
  { "id": 117, "name": "Владая" },
  { "id": 118, "name": "Мърчаево" },
  { "id": 119, "name": "Камбаните" },
  { "id": 120, "name": "в.з. Малинова долина" },
  { "id": 121, "name": "в.з. Черният кос" },
  { "id": 122, "name": "Св. Магдалена" },
  { "id": 123, "name": "Модерно предградие" },
  { "id": 124, "name": "Обеля" },
  { "id": 125, "name": "Връбница -1" },
  { "id": 126, "name": "Връбница -2" },
  { "id": 127, "name": "Обеля -1" },
  { "id": 128, "name": "Обеля - 2" },
  { "id": 129, "name": "Република 2" },
  { "id": 130, "name": "Толева махала" },
  { "id": 131, "name": "Волуяк" },
  { "id": 132, "name": "Мрамор" },
  { "id": 133, "name": "Дружба 1" },
  { "id": 134, "name": "Димитър Миленков" },
  { "id": 135, "name": "Дружба 2" },
  { "id": 136, "name": "Абдовица" },
  { "id": 137, "name": "Гара Искър" },
  { "id": 138, "name": "Бусманци" },
  { "id": 139, "name": "Кремиковци" },
  { "id": 140, "name": "Сеславци" },
  { "id": 141, "name": "Ботунец" },
  { "id": 142, "name": "Челопечене" },
  { "id": 143, "name": "Враждебна" },
  { "id": 144, "name": "Бухово" },
  { "id": 145, "name": "Желява" },
  { "id": 146, "name": "Яна" },
  { "id": 147, "name": "Горни Богров" },
  { "id": 148, "name": "Долни Богров" },
  { "id": 149, "name": "Батареята" },
  { "id": 150, "name": "Овча Купел" },
  { "id": 151, "name": "Овча купел 2" },
  { "id": 152, "name": "Овча купел 1" },
  { "id": 153, "name": "Горна Баня" },
  { "id": 154, "name": "Суходол" },
  { "id": 155, "name": "Мало Бучино" },
  { "id": 156, "name": "в.з. Бонсови поляни" },
  { "id": 157, "name": "Банкя" },
  { "id": 158, "name": "Банкя - кв. Вердикал" },
  { "id": 159, "name": "Банкя - кв. Градоман" },
  { "id": 160, "name": "Банкя- кв. Изгрев" },
  { "id": 161, "name": "Банкя - кв. Михайлово" },
  { "id": 162, "name": "Клисура" },
  { "id": 163, "name": "Клисура - мах. Витковица" },
  { "id": 164, "name": "Клисура - Радова мах." },
  { "id": 165, "name": "Иваняне" },
  { "id": 166, "name": "в.з. Лагера" },
  { "id": 167, "name": "в.з. Банкя" },
  { "id": 168, "name": "в.з. Бели брег" },
  { "id": 169, "name": "Нови Искър - кв. Гниляне" },
  { "id": 170, "name": "Нови Искър - кв. Изгрев" },
  { "id": 171, "name": "Нови Искър - кв. Кумарица" },
  { "id": 172, "name": "Нови Искър - кв. Курило" },
  { "id": 173, "name": "Нови Искър - кв. Славовица" },
  { "id": 174, "name": "Балша" },
  { "id": 175, "name": "Кътина" },
  { "id": 176, "name": "Житен" },
  { "id": 177, "name": "Войнеговци" },
  { "id": 178, "name": "Мировяне" },
  { "id": 179, "name": "Доброславци" },
  { "id": 180, "name": "Подгумер" },
  { "id": 181, "name": "Локорско" },
  { "id": 182, "name": "Чепинци" },
  { "id": 183, "name": "Негован" },
  { "id": 184, "name": "Световрачене" },
  { "id": 185, "name": "Кубратово" },
  { "id": 186, "name": "Япаджа" },
  { "id": 187, "name": "Нови Искър - в.з. Ласка" },
  { "id": 188, "name": "Бистрица" },
  { "id": 189, "name": "Панчарево" },
  { "id": 190, "name": "Железница" },
  { "id": 191, "name": "Герман" },
  { "id": 192, "name": "Казичене" },
  { "id": 193, "name": "Лозен - Долни" },
  { "id": 194, "name": "Лозен-Горни" },
  { "id": 195, "name": "Кривина" },
  { "id": 196, "name": "Долни Пасарел" },
  { "id": 197, "name": "Плана" },
  { "id": 198, "name": "Кокаляне" },
  { "id": 199, "name": "Малинова долина- Герена" },
  { "id": 200, "name": "Бункера" },
  { "id": 201, "name": "в.з. Лозен" },
  { "id": 202, "name": "ПЗ Илиянци" },
  { "id": 203, "name": "Индустриална зона" },
  { "id": 204, "name": "МК Кремиковци" },
  { "id": 205, "name": "Летище София" },
  { "id": 206, "name": "Пречиствателна станция" },
  { "id": 207, "name": "НПЗ Средец" },
  { "id": 208, "name": "СПЗ Модерно предградие" },
  { "id": 209, "name": "ПЗ Хладилника" },
  { "id": 210, "name": "НПЗ Изток" },
  { "id": 211, "name": "ПЗ Илиянци" },
  { "id": 212, "name": "ПЗ Хладилен завод" },
  { "id": 213, "name": "СПЗ Слатина" }

];
// Loader to fetch neighborhood data
export const loader: LoaderFunction = async () => {
  return json(neighborhoods);
};

export default function NeighborhoodsPage() {
  const data = useLoaderData<typeof neighborhoods>();
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  // Check if we are in the client environment
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  const handleNeighborhoodClick = (id: number) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(id) ? prev.filter((neighId) => neighId !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: number) => {
    setSelectedNeighborhoods((prev) => prev.filter((neighId) => neighId !== id));
  };

  const filterNeighborhoods = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll("#neighborhoodList li");

    listItems.forEach((item) => {
      const text = item.textContent?.toLowerCase() || "";
      item.classList.toggle("hidden", !text.includes(searchTerm));
    });
  };

  const sendSelectedNeighborhoodsToBackend = () => {
    if (selectedNeighborhoods.length === 0) {
      alert("Please select at least one neighborhood.");
      return;
    }
    
    const queryParams = new URLSearchParams({
      neighborhoods: selectedNeighborhoods.join(","),
    }).toString();
  
    navigate(`/catalog?${queryParams}`);
  };
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Select Neighborhood */}
          <div className="bg-white p-4 rounded shadow h-[500px]">
            <h3 className="text-xl font-bold mb-4">Select Neighborhood</h3>
            <input
              type="text"
              id="searchNeighborhood"
              placeholder="Search for a neighborhood..."
              onChange={filterNeighborhoods}
              className="w-full p-2 border rounded mb-4"
            />
            <ul id="neighborhoodList" className="space-y-2 overflow-y-auto h-[350px]">
              {data.map((neighborhood) => (
                <button
                  key={neighborhood.id}
                  className={`w-full text-left p-2 rounded cursor-pointer bg-gray-100 hover:bg-blue-500 hover:text-white ${selectedNeighborhoods.includes(neighborhood.id) ? "bg-green-500 text-white" : ""
                    }`}
                  onClick={() => handleNeighborhoodClick(neighborhood.id)}
                >
                  {neighborhoodsNames.find((n) => n.id === neighborhood.id)?.name}
                </button>
              ))}
            </ul>
          </div>

          {/* Map Section */}
          <div className="bg-white p-4 rounded shadow h-[500px]">
            <h3 className="text-xl font-bold mb-4">Map</h3>
            {isClient && (
              <MapComponent
                data={data}
                onNeighborhoodClick={handleNeighborhoodClick}
                selectedNeighborhoods={selectedNeighborhoods}
              />
            )}
          </div>

          {/* Remove Neighborhoods */}
          <div className="bg-white p-4 rounded shadow h-[500px]">
            <h3 className="text-xl font-bold mb-4">Remove Neighborhoods</h3>
            <ul className="space-y-2 h-[350px] overflow-y-auto">
              {selectedNeighborhoods.map((id) => {
                const neighborhood = neighborhoodsNames.find((n) => n.id === id);
                return (
                  <li
                    key={id}
                    className="p-2 rounded bg-green-500 text-white flex justify-between items-center"
                  >
                    {neighborhood?.name}
                    <button
                      onClick={() => handleRemove(id)}
                      className="bg-red-500 hover:bg-red-700 text-white rounded px-2"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={sendSelectedNeighborhoodsToBackend}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
            >
              Submit Selected Neighborhoods
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
