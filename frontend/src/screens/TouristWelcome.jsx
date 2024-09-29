import TouristInstructionCard from "../components/TouristInstructionCard";
import TouristNavBar from "../components/TouristNavBar";
import airplaneImage from "../assets/airplane.png";
import { Fade } from "react-awesome-reveal";

const cards = [
  {
    superTitle: "GET Started",
    title: "Book your Flight!",
    desc: "The best part about booking a flight is that you don’t need to stress over the details – just pick your destination, and you’re halfway there. Whether it’s a quick getaway or an adventure abroad, booking is simple and hassle-free. No complicated steps, just click and get ready to take off!",
    img: airplaneImage,
    waterMark: "01",
  },
  {
    superTitle: "GET Started",
    title: "Book your Flight!",
    desc: "The best part about booking a flight is that you don’t need to stress over the details – just pick your destination, and you’re halfway there. Whether it’s a quick getaway or an adventure abroad, booking is simple and hassle-free. No complicated steps, just click and get ready to take off!",
    img: airplaneImage,
    waterMark: "01",
  },
  {
    superTitle: "GET Started",
    title: "Book your Flight!",
    desc: "The best part about booking a flight is that you don’t need to stress over the details – just pick your destination, and you’re halfway there. Whether it’s a quick getaway or an adventure abroad, booking is simple and hassle-free. No complicated steps, just click and get ready to take off!",
    img: airplaneImage,
    waterMark: "01",
  },
];

const TouristWelcome = () => {
  return (
    <div className='relative bg-[#075B4C] z-10 overflow-scroll  size-full flex flex-col  items-center h-[100vh] before:content-[""] before:bg-fit before:bg-no-repeat before:size-full before:absolute before:z-[0] before:animate-tourist-background'>
      <TouristNavBar />
      <Fade
        className="text-white left-[100px] top-[20%] absolute"
        direction="up"
        cascade
      >
        <h1 className=" lg:text-[88px] text-xl leading-10 sm:text-[50px] sm:leading-[50px] font-semibold lg:leading-[100px] ">
          Prepare To See The <br />
          World!
        </h1>
      </Fade>
      <Fade
        className="text-white left-[100px] top-[40%] absolute"
        direction="up"
        cascade
      >
        <span>Scroll down</span>
      </Fade>
      <main className="w-[80%] h-full mt-[100vh]  gap-20 justify-center flex flex-col  m-0">
        {cards.map((card, index) => (
          <TouristInstructionCard
            key={index}
            {...card}
            leftToRight={index % 2 === 0}
          />
        ))}
      </main>
    </div>
  );
};

export default TouristWelcome;
