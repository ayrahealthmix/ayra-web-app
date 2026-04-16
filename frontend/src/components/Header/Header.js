import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.scss";
import Logo from "../../assets/images/logo.png";
import jsonData from "../../services/data.json";
import { useIsMobile } from "../../hooks/useIsMobile";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import ModalPopup from "../ModalPopup/ModalPopup";
import Search from "./Search";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const location = useLocation();
  const { offers } = jsonData;
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpenMenu(false);
    setOpenSearch(false);
  }, [location.pathname]);

  const MenuItemUi = () => {
    return (
      <nav className="nav">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/list/all"
          className={
            location.pathname.includes("/list") ||
            location.pathname.includes("/details")
              ? "active"
              : ""
          }
        >
          Shop
        </Link>
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
        >
          Contact
        </Link>
      </nav>
    );
  };

  return (
    <>
      <section className="announcement-bar">
        <div className="announcement-track">
          {offers.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </section>
      <header className="header-cntnr">
        <div className="header-main">
          <Link to="/">
            <img className="logo" src={Logo} alt="logo" />
          </Link>
          {isMobile ? (
            <div className="mobile-menu">
              <span
                onClick={() => {
                  setOpenSearch(!openSearch);
                }}
                className="search"
              >
                <SearchIcon />
              </span>
              <span className="ham-burger" onClick={() => setOpenMenu(true)}>
                <MenuIcon />
              </span>
            </div>
          ) : (
            <>
              {MenuItemUi()}
              <Search />
            </>
          )}
        </div>
      </header>
      <ModalPopup
        open={openSearch}
        handleClose={() => {
          setOpenSearch(false);
        }}
        title="Search Products"
      >
        <Search isMobile={true} onClose={() => setOpenSearch(false)} />
      </ModalPopup>
      <Drawer anchor="left" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: "90vw" }}>{MenuItemUi()}</Box>
      </Drawer>
    </>
  );
}
