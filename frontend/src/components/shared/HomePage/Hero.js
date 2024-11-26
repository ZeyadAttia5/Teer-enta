import React from "react";

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('/path-to-image.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl font-bold">Explore the World</h1>
        <p className="mt-4 text-lg">Discover activities, attractions, and tours wherever you go.</p>
      </div>
    </section>
  );
};

export default HeroSection;
