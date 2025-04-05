import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import DepedLogo from "../../assets/deped_logo.png";
import ProfileMenu from "../DropDownMenus/ProfileMenu";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, width }) => ({
  background:
    // "linear-gradient(40deg, rgba(66, 201, 116, 1), rgba(59, 152, 184, 1), rgba(26, 214, 164, 1))",
    "black",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: width,
    width: `calc(100% - ${width}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Topbar({
  themeProp,
  drawerWidth,
  openDrawerFunction,
  drawerOpenStatus,
}) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      <StyledAppBar
        position="fixed"
        theme={themeProp}
        open={drawerOpenStatus}
        width={drawerWidth}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={openDrawerFunction}
              edge="start"
              sx={{
                // color: "#434343",
                marginRight: 5,
                ...(drawerOpenStatus && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={handleNavigate}
              component="img"
              variant="img"
              src={DepedLogo}
              sx={{
                mr: 2,
                my: 1,
                width: "60px",
                cursor: "pointer",
                "@media (min-height: 1920px)": {
                  width: "100px",
                },
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontFamily: "Poppins" }}
            >
              SDOIC - TRIP TICKET MANAGEMENT PANEL
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mr: 5,
            }}
          >
            <ProfileMenu />
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}

export default Topbar;
