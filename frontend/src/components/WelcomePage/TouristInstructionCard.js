import { Card } from "antd";
import { Fade } from "react-awesome-reveal";

const TouristInstructionCard = ({
  superTitle,
  title,
  desc,
  img,
  waterMark,
  leftToRight = true,
}) => {
  return (
    <Fade direction={leftToRight ? "left" : "right"}>
      <Card
        className={`flex bg-transparent items-center w-full mb-20 h-[480px] relative border-none ${
          leftToRight ? "xl:flex-row-reverse" : "xl:flex-row"
        }  flex-col-reverse `}
        data-aos="fade-up"
        classNames={{ cover: "size-11/12 xl:size-full ", body: "text-white" }}
        cover={<img className="h-full" src={img} alt={title} />}
      >
        <sup className="flex font-extrabold text-[18px] text-[#FBD784] items-center leading-5 tracking-[6px] ">
          <hr className=" h-[3px] bg-[#FBD784]  text-[18px] w-[30%] mr-2" />
          {superTitle}
        </sup>
        <Card.Meta
          title={
            <span className="text-white break-words text-md xl:text-[64px] font-semibold ">
              {title}
            </span>
          }
          description={
            <span className="text-white xl:text-[18px] text-sm font-bold leading-8">
              {desc}n{" "}
            </span>
          }
        />
        <span
          className={`text-white opacity-20 font-bold text-[240px] leading-[240px] absolute top-[-40%] left-0 xl:top-0 
          ${leftToRight ? "xl:left-0" : "xl:left-1/3"}  mr-2 mb-2`}
        >
          {waterMark}
        </span>
      </Card>
    </Fade>
  );
};

export default TouristInstructionCard;