import React from "react";

function VideoWithTitle() {
  const title = "Teer-Enta";
  const videoUrl = "https://www.youtube.com/embed/fdcmhMp8WiY?autoplay=1"; // Autoplay with muted audio

  return (
    <div className="flex flex-col items-center p-4">
      <iframe
        src={videoUrl}
        title={title}
        className="w-80 h-48 rounded-md shadow-lg mb-2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

export default VideoWithTitle;
