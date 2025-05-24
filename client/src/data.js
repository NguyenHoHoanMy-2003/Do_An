import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import {
  FaSkiing,
  FaPumpSoap,
  FaShower,
  FaFireExtinguisher,
  FaUmbrellaBeach,
  FaKey,
} from "react-icons/fa";
import { FaHouseUser, FaPeopleRoof, FaKitchenSet } from "react-icons/fa6";
import {
  BiSolidWasher,
  BiSolidDryer,
  BiSolidFirstAid,
  BiWifi,
  BiSolidFridge,
  BiWorld,
} from "react-icons/bi";
import { BsSnow, BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla, MdMicrowave, MdBalcony, MdYard, MdPets } from "react-icons/md";
import {
  PiBathtubFill,
  PiCoatHangerFill,
  PiTelevisionFill,
} from "react-icons/pi";
import { TbIroning3 } from "react-icons/tb";
import {
  GiHeatHaze,
  GiCctvCamera,
  GiBarbecue,
  GiToaster,
  GiCampfire,
} from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { CgGym } from "react-icons/cg";
import { MdFreeBreakfast } from "react-icons/md";
import { MdElectricBolt } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { GiHouse } from "react-icons/gi";
import { FaHouse } from "react-icons/fa6";
export const categories = [

  
  {
    label: "Wifi",
    icon: <BiWifi />,
  },
  {
    label: "Free parking",
    icon: <AiFillCar />,
  },
  {
    label: "Private Space",
    icon: <AiFillHome />,
  },
  {
    label: "Fitness Gym",
    icon: <CgGym />,
  },
  {
    label: "Breakfast",
    icon: <MdFreeBreakfast />,
  },
  {
    label: "24/7 Light",
    icon: <MdElectricBolt />,
  },
  {
    label: "Other",
    icon: <MdMoreHoriz />,
  },

  // {
  //   label: "All",
  //   icon: <BiWorld />,
  // },
  // {
  //   img: "assets/beach_cat.jpg",
  //   label: "Beachfront",
  //   icon: <TbBeach />,
  //   description: "This property is close to the beach!",
  // },
  // {
  //   img: "assets/windmill_cat.webp",
  //   label: "Windmills",
  //   icon: <GiWindmill />,
  //   description: "This property is has windmills!",
  // },
  // {
  //   img: "assets/modern_cat.webp",
  //   label: "Iconic cities",
  //   icon: <MdOutlineVilla />,
  //   description: "This property is modern!",
  // },
  // {
  //   img: "assets/countryside_cat.webp",
  //   label: "Countryside",
  //   icon: <TbMountain />,
  //   description: "This property is in the countryside!",
  // },
  // {
  //   img: "assets/pool_cat.jpg",
  //   label: "Amazing Pools",
  //   icon: <TbPool />,
  //   description: "This is property has a beautiful pool!",
  // },
  // {
  //   img: "assets/island_cat.webp",
  //   label: "Islands",
  //   icon: <GiIsland />,
  //   description: "This property is on an island!",
  // },
  // {
  //   img: "assets/lake_cat.webp",
  //   label: "Lakefront",
  //   icon: <GiBoatFishing />,
  //   description: "This property is near a lake!",
  // },
  // {
  //   img: "assets/skiing_cat.jpg",
  //   label: "Ski-in/out",
  //   icon: <FaSkiing />,
  //   description: "This property has skiing activies!",
  // },
  // {
  //   img: "assets/castle_cat.webp",
  //   label: "Castles",
  //   icon: <GiCastle />,
  //   description: "This property is an ancient castle!",
  // },
  // {
  //   img: "assets/cave_cat.jpg",
  //   label: "Caves",
  //   icon: <GiCaveEntrance />,
  //   description: "This property is in a spooky cave!",
  // },
  // {
  //   img: "assets/camping_cat.jpg",
  //   label: "Camping",
  //   icon: <GiForestCamp />,
  //   description: "This property offers camping activities!",
  // },
  // {
  //   img: "assets/arctic_cat.webp",
  //   label: "Arctic",
  //   icon: <BsSnow />,
  //   description: "This property is in arctic environment!",
  // },
  // {
  //   img: "assets/desert_cat.webp",
  //   label: "Desert",
  //   icon: <GiCactus />,
  //   description: "This property is in the desert!",
  // },
  // {
  //   img: "assets/barn_cat.jpg",
  //   label: "Barns",
  //   icon: <GiBarn />,
  //   description: "This property is in a barn!",
  // },
  // {
  //   img: "assets/lux_cat.jpg",
  //   label: "Luxury",
  //   icon: <IoDiamond />,
  //   description: "This property is brand new and luxurious!",
  // },
];
export const filters = [
  {
    label: "Filter",
    icon: <CiFilter />,
  }
];

export const types = [
  {
    name: "An entire place",
    description: "You’ll have a private and self-contained space that includes a bedroom, bathroom, and kitchen. You won’t share any interior space with others. ",
    icon: <FaHouseUser />,
  },

  {
    name: "A Shared Room",
    description: "You’ll stay in the same room with other guests or tenants.uitable for budget-conscious renters or those who are comfortable with communal living.",
    icon: <FaPeopleRoof />,
  },

  {
    name: "Whole House",
    description: "Renters get full access to an entire house — not just an apartment or single room.Ideal for families, groups, or tenants who want maximum space and privacy.",
    icon: <GiHouse />,
  },

  {
    name: "Mini Apartment",
    description: "A compact and fully equipped apartment designed for one or two people. It typically includes a bedroom, a small kitchen, a bathroom, and sometimes a living area.",
    icon: <FaHouse />,
  },
];

export const facilities = [

  {
    name: "Washer",
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer",
    icon: <BiSolidDryer />,
  },
  
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  
  {
    name: "Air Conditioning",
    icon: <BsSnow />,
  },
  
  {
    name: "Security cameras",
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid",
    icon: <BiSolidFirstAid />,
  },
  

  {
    name: "Refrigerator",
    icon: <BiSolidFridge />,
  },
  
  {
    name: "Private patio or Balcony",
    icon: <MdBalcony />,
  },

  {
    name: " Pet allowed",
    icon: <MdPets />
  }
];