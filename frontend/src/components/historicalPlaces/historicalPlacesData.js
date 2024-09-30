// import Petra from './imgs/Petra.jpeg';
// import greatWallOfChina from './imgs/The Great Wall of China.jpeg';
// import machuPicchu from './imgs/Machu Picchu.jpeg';
// import angkorWat from './imgs/Angkor Wat.jpeg';
// import Pyramids from "./imgs/Pyramids of Giza.jpeg";
// import eiffelTower from "./imgs/Eiffel Towerjpeg.jpeg";
// import colosseum from "./imgs/Colosseumjpeg.jpeg";
// import tajMahal from "./imgs/Taj Mahal.jpeg";
// import stronehenge from "./imgs/Stonehenge.jpeg";
// import chichenItza from "./imgs/Chichen Itza.jpeg";
// import buckinghamPalace from "./imgs/buckinghamPalace.jpeg";
// import neuschwansteinCastle from "./imgs/neuschwansteinCastle.jpeg";
// import louvreMuseum from "./imgs/louvreMuseum.jpeg";
// import notreDame from "./imgs/notreDame.jpeg";
// import stPetersBasilica from "./imgs/stPetersBasilica.jpeg";
// import versaillesPalace from "./imgs/versaillesPalace.jpeg";
// import alhambra from "./imgs/alhambra.jpeg";
// import smithsonianInstitution from "./imgs/smithsonianInstitution.jpeg";
// import vaticanMuseums from "./imgs/vaticanMuseums.jpeg";
// import edinburghCastle from "./imgs/edinburghCastle.jpeg";
// import topkapiPalace from "./imgs/topkapiPalace.jpeg";
// import sagradaFamilia from "./imgs/sagradaFamilia.jpeg";
// import britishMuseum from "./imgs/britishMuseum.jpeg";

// import axios from "axios";

// const historicalPlacesData = [
//   {
//     name: "The Great Wall of China",
//     location: "China",
//     description: "The Great Wall is an ancient series of walls and fortifications, built to protect Chinese states from invasions. It stretches over 13,000 miles.",
//     images: ["https://images.travelandleisureasia.com/wp-content/uploads/sites/3/2023/02/02192048/great-wall-of-china.jpeg"],
//     tag: "Monuments",
//     openingHours: "8:00 AM - 5:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 60 },
//       { type: "Student", price: 30 },
//       { type: "Native", price: 40 }
//     ]
//   },
//   {
//     name: "Machu Picchu",
//     location: "Peru",
//     description: "Machu Picchu is an Incan citadel set high in the Andes Mountains, renowned for its sophisticated dry-stone construction.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "6:00 AM - 5:30 PM",
//     tickets: [
//       { type: "Foreigner", price: 50 },
//       { type: "Student", price: 25 },
//       { type: "Native", price: 35 }
//     ]
//   },
//   {
//     name: "Pyramids of Giza",
//     location: "Egypt",
//     description: "The Pyramids of Giza are monumental tombs built for the Egyptian Pharaohs, showcasing extraordinary engineering and architecture.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "8:00 AM - 4:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 80 },
//       { type: "Student", price: 40 },
//       { type: "Native", price: 50 }
//     ]
//   },
//   {
//     name: "Eiffel Tower",
//     location: "France",
//     description: "The Eiffel Tower is a wrought-iron lattice tower in Paris, a global cultural icon of France and one of the most recognizable structures in the world.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "9:00 AM - 12:45 AM",
//     tickets: [
//       { type: "Foreigner", price: 25 },
//       { type: "Student", price: 15 },
//       { type: "Native", price: 20 }
//     ]
//   },
//   {
//     name: "Colosseum",
//     location: "Italy",
//     description: "The Colosseum is an ancient amphitheater in Rome, the largest ever built, and an enduring symbol of Roman engineering and culture.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "8:30 AM - 7:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 30 },
//       { type: "Student", price: 15 },
//       { type: "Native", price: 20 }
//     ]
//   },
//   {
//     name: "Taj Mahal",
//     location: "India",
//     description: "The Taj Mahal is an ivory-white marble mausoleum built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, symbolizing eternal love.",
//     images: [""],
//     tag: "Palaces",
//     openingHours: "6:00 AM - 7:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 45 },
//       { type: "Student", price: 20 },
//       { type: "Native", price: 25 }
//     ]
//   },
//   {
//     name: "Stonehenge",
//     location: "England",
//     description: "Stonehenge is a prehistoric monument consisting of a ring of massive standing stones, whose purpose remains a mystery.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "9:30 AM - 7:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 40 },
//       { type: "Student", price: 20 },
//       { type: "Native", price: 25 }
//     ]
//   },
//   {
//     name: "Petra",
//     location: "Jordan",
//     description: "Petra is an archaeological site in Jordan famous for its rock-cut architecture and water conduit system, often called the 'Rose City.'",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "6:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 70 },
//       { type: "Student", price: 35 },
//       { type: "Native", price: 40 }
//     ]
//   },
//   {
//     name: "Angkor Wat",
//     location: "Cambodia",
//     description: "Angkor Wat is the largest religious monument in the world, originally constructed as a Hindu temple dedicated to the god Vishnu.",
//     images: [""],
//     tag: "Religious Sites",
//     openingHours: "5:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 50 },
//       { type: "Student", price: 25 },
//       { type: "Native", price: 30 }
//     ]
//   },
//   {
//     name: "Chichen Itza",
//     location: "Mexico",
//     description: "Chichen Itza is a complex of Mayan ruins on Mexico’s Yucatán Peninsula, known for the step pyramid El Castillo, which served as a temple to the god Kukulkan.",
//     images: [""],
//     tag: "Monuments",
//     openingHours: "8:00 AM - 5:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 30 },
//       { type: "Student", price: 15 },
//       { type: "Native", price: 20 }
//     ]
//   },
//   {
//     name: "Buckingham Palace",
//     location: "United Kingdom",
//     description: "Buckingham Palace is the London residence and administrative headquarters of the monarch of the United Kingdom.",
//     images: [""],
//     tag: "Palaces",
//     openingHours: "9:30 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 25 },
//       { type: "Student", price: 12 },
//       { type: "Native", price: 18 }
//     ]
//   },
//   {
//     name: "Neuschwanstein Castle",
//     location: "Germany",
//     description: "Neuschwanstein Castle is a 19th-century Romanesque Revival palace perched on a rugged hill above the village of Hohenschwangau in southwest Bavaria, Germany.",
//     images: [""],
//     tag: "Castles",
//     openingHours: "9:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 15 },
//       { type: "Student", price: 8 },
//       { type: "Native", price: 10 }
//     ]
//   },
//   {
//     name: "Louvre Museum",
//     location: "France",
//     description: "The Louvre is the world's largest art museum and a historic monument in Paris, France, housing works such as the Mona Lisa.",
//     images: [""],
//     tag: "Museums",
//     openingHours: "9:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 17 },
//       { type: "Student", price: 10 },
//       { type: "Native", price: 12 }
//     ]
//   },
//   {
//     name: "Notre Dame Cathedral",
//     location: "France",
//     description: "Notre-Dame de Paris is a medieval Catholic cathedral on the Île de la Cité in Paris, widely considered one of the finest examples of French Gothic architecture.",
//     images: [""],
//     tag: "Religious Sites",
//     openingHours: "8:00 AM - 6:30 PM",
//     tickets: [
//       { type: "Foreigner", price: 10 },
//       { type: "Student", price: 5 },
//       { type: "Native", price: 7 }
//     ]
//   },
//   {
//     name: "St. Peter's Basilica",
//     location: "Vatican City",
//     description: "St. Peter's Basilica is a Renaissance church in Vatican City, regarded as one of the holiest Catholic shrines.",
//     images: [""],
//     tag: "Religious Sites",
//     openingHours: "7:00 AM - 7:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 10 },
//       { type: "Student", price: 5 },
//       { type: "Native", price: 8 }
//     ]
//   },
//   {
//     name: "Palace of Versailles",
//     location: "France",
//     description: "The Palace of Versailles is a former royal residence located just outside of Paris, known for its opulent architecture and vast gardens.",
//     images: [""],
//     tag: "Palaces",
//     openingHours: "9:00 AM - 6:30 PM",
//     tickets: [
//       { type: "Foreigner", price: 20 },
//       { type: "Student", price: 12 },
//       { type: "Native", price: 15 }
//     ]
//   },
//   {
//     name: "Alhambra",
//     location: "Spain",
//     description: "The Alhambra is a palace and fortress complex located in Granada, Spain, famous for its Islamic architecture and stunning gardens.",
//     images: [""],
//     tag: "Palaces",
//     openingHours: "8:30 AM - 8:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 14 },
//       { type: "Student", price: 7 },
//       { type: "Native", price: 10 }
//     ]
//   },
//   {
//     name: "Smithsonian Institution",
//     location: "United States",
//     description: "The Smithsonian Institution is a group of museums and research centers in Washington, D.C., known for its extensive collections and exhibitions.",
//     images: [""],
//     tag: "Museums",
//     openingHours: "10:00 AM - 5:30 PM",
//     tickets: [
//       { type: "Foreigner", price: 0 },
//       { type: "Student", price: 0 },
//       { type: "Native", price: 0 }
//     ]
//   },
//   {
//     name: "Vatican Museums",
//     location: "Vatican City",
//     description: "The Vatican Museums are a group of art and Christian museums situated within Vatican City, housing some of the world's most renowned artworks.",
//     images: [""],
//     tag: "Museums",
//     openingHours: "9:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 17 },
//       { type: "Student", price: 10 },
//       { type: "Native", price: 12 }
//     ]
//   },
//   {
//     name: "Edinburgh Castle",
//     location: "Scotland",
//     description: "Edinburgh Castle is a historic fortress located on Castle Rock, overlooking the city of Edinburgh, known for its rich history and stunning views.",
//     images: [""],
//     tag: "Castles",
//     openingHours: "9:30 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 20 },
//       { type: "Student", price: 10 },
//       { type: "Native", price: 15 }
//     ]
//   },
//   {
//     name: "Topkapi Palace",
//     location: "Turkey",
//     description: "Topkapi Palace is a large museum in Istanbul, formerly the residence of Ottoman sultans, showcasing imperial collections and stunning architecture.",
//     images: [""],
//     tag: "Palaces",
//     openingHours: "9:00 AM - 6:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 15 },
//       { type: "Student", price: 8 },
//       { type: "Native", price: 10 }
//     ]
//   },
//   {
//     name: "Sagrada Familia",
//     location: "Spain",
//     description: "The Sagrada Familia is a large unfinished Roman Catholic basilica in Barcelona, designed by architect Antoni Gaudí, known for its unique architectural style.",
//     images: [""],
//     tag: "Religious Sites",
//     openingHours: "9:00 AM - 8:00 PM",
//     tickets: [
//       { type: "Foreigner", price: 26 },
//       { type: "Student", price: 15 },
//       { type: "Native", price: 18 }
//     ]
//   },
//   {
//     name: "British Museum",
//     location: "United Kingdom",
//     description: "The British Museum is a world-famous museum dedicated to human history, art, and culture, housing millions of works from all continents.",
//     images: [""],
//     tag: "Museums",
//     openingHours: "10:00 AM - 5:30 PM",
//     tickets: [
//       { type: "Foreigner", price: 0 },
//       { type: "Student", price: 0 },
//       { type: "Native", price: 0 }
//     ]
//   }
// ];

// let historicalPlacesData = [];

// const fetchHistoricalPlacesData = async () => {
//   try {
//     const response = await axios.get("http://localhost:3000/historicalPlace");
//     historicalPlacesData = response.data;
//     console.log(historicalPlacesData);  // This will log the fetched data to ensure it's working
//   } catch (error) {
//     console.error("Error fetching historical places data:", error);
//   }
// };

// Call the function to fetch data
// fetchHistoricalPlacesData();





// export default historicalPlacesData;
