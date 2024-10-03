// src/utils/loadImages.js
const importAll = (r) => {
    let images = [];
    r.keys().forEach((item) => {
      images.push(r(item));
    });
    return images;
  };
  
  // Update the regex to include .jpeg extension
  export const images = importAll(require.context('../../assets', false, /\.(png|jpe?g|svg)$/));
  