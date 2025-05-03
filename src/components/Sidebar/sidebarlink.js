import DataIcon from "@mui/icons-material/Description";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const links = [
  {
    title: "Data",
    role: "admin",
    links: [
      {
        name: "Pending Tickets",
        path: "Administration",
        icon: <PendingActionsIcon />,
      },
    ],
  },
  {
    title: "Approved Tickets",
    role: "admin",
    links: [
      {
        name: "Approved Tickets",
        path: "Approved",
        icon: <MarkEmailReadIcon />,
      },
    ],
  },
  {
    title: "Users",
    role: "admin",
    links: [
      {
        name: "Users",
        path: "Users",
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
