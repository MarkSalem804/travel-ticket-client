import DataIcon from "@mui/icons-material/Description";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CameraFrontIcon from "@mui/icons-material/CameraFront";

const links = [
  {
    title: "Data",
    role: "admin",
    links: [
      {
        name: "Tickets",
        path: "Administration",
        icon: <DataIcon />,
      },
    ],
  },
  {
    title: "Users",
    role: "admin",
    links: [
      {
        name: "Users",
        path: "Administration",
        icon: <PeopleAltIcon />,
      },
    ],
  },
  {
    title: "Vehicles",
    role: "admin",
    links: [
      {
        name: "Vehicles",
        path: "Vehicles",
        icon: <DirectionsCarIcon />,
      },
    ],
  },
  {
    title: "Drivers",
    role: "admin",
    links: [
      {
        name: "Drivers",
        path: "Drivers",
        icon: <CameraFrontIcon />,
      },
    ],
  },
];

export default links;
