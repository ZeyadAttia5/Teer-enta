import React from "react";

import HeroSection from "./Hero.js";
import SearchBar from "./SearchHome.js";
import Card from "./CardHome.js";


const Home = () => {
  const mockData = [
    {
      title: "Eiffel Tower Tour",
      image: "/path-to-image.jpg",
      description: "Experience the beauty of Paris from the top of the Eiffel Tower.",
    },
    {
      title: "Grand Canyon Adventure",
      image: "/path-to-image2.jpg",
      description: "Explore the breathtaking views of the Grand Canyon.",
    },
  ];

  return (
    <div>
      
      <HeroSection />
      <SearchBar />
      <div className="grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {mockData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
