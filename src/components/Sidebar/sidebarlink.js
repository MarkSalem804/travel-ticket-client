import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CameraFrontIcon from "@mui/icons-material/CameraFront";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import GroupsIcon from "@mui/icons-material/Groups";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

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
  {
    title: "Top Management Trips",
    role: "admin",
    links: [
      {
        name: "Top Management Trips",
        path: "UrgentTrips",
        icon: <AlarmOnIcon />,
      },
    ],
  },
  {
    title: "Employee Trips",
    role: "admin",
    links: [
      {
        name: "Employees",
        path: "EmployeeTrips",
        icon: <GroupsIcon />,
      },
    ],
  },
  {
    title: "Urgent Today's Trips",
    role: "admin",
    links: [
      {
        name: "Urgent Today's Trips",
        path: "UrgentTodaysTrips",
        icon: <InsertInvitationIcon />,
      },
    ],
  },
];

export default links;
