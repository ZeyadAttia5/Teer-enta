import React from "react";
import "./flipableCard.css";
const FlipableCard = ({
  front,
  back,
  frontClassName = "",
  backClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`  size-fit  hover:shadow cardContainer`}>
      <div
        className={`${containerClassName} relative border transition-all`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={frontClassName}
          style={{ backfaceVisibility: "hidden", position: "absolute" }}
        >
          {front}
        </div>
        <div
          className={backClassName + " back"}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipableCard;
