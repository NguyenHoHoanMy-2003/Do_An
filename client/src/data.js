import { BiWifi } from "react-icons/bi";
import { AiFillCar, AiFillHome } from "react-icons/ai";
import { CgGym } from "react-icons/cg";
import { MdFreeBreakfast, MdElectricBolt, MdMoreHoriz } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { GiHouse } from "react-icons/gi";
import { FaHouse } from "react-icons/fa6";
import { FaHouseUser, FaPeopleRoof } from "react-icons/fa6";
import { BiSolidWasher, BiSolidDryer, BiSolidFirstAid } from "react-icons/bi";
import { PiTelevisionFill } from "react-icons/pi";
import { BsSnow } from "react-icons/bs";
import { GiCctvCamera } from "react-icons/gi";
import { FaFireExtinguisher } from "react-icons/fa";

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
    description: "You'll have a private and self-contained space that includes a bedroom, bathroom, and kitchen. You won't share any interior space with others. ",
    icon: <FaHouseUser />,
  },
  {
    name: "A Shared Room",
    description: "You'll stay in the same room with other guests or tenants.uitable for budget-conscious renters or those who are comfortable with communal living.",
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
];