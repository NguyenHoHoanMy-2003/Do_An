import {
  IconButton,
  Popover,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setLogout } from "../redux/state";
import variables from "../styles/variables.scss";
import "../styles/Navbar.scss";
import { filters } from "../data";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState({ location: "", price: "", area: "" });

  const userState = useSelector((state) => state.user);
  const user = userState?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    const query = `?location=${filter.location}&area=${filter.area}&price=${filter.price}`;
    const fullSearchPath = search ? `/properties/search/${search}` : "/properties/search";
    navigate(`${fullSearchPath}${query}`);
    handleFilterClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  return (
    <div className="navbar">
      <div className="navbar_logo_group">
        <a href="/">
          <img src="/assets/logo1.png" alt="logo" />
        </a>
        <p className="navbar_brand">Bonheuris</p>
      </div>

      <div className="navbar_search_filter">
        <div className="navbar_search">
          <input
            type="text"
            placeholder="Search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search !== "") {
                navigate(`/properties/search/${search}`);
              }
            }}
          />
          <IconButton
            disabled={search === ""}
            onClick={() => navigate(`/properties/search/${search}`)}
          >
            <Search sx={{ color: variables.pinkred }} />
          </IconButton>
        </div>

        <div className="navbar_filter">
          <IconButton onClick={handleFilterClick}>
            {filters[0].icon}
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
          >
            <div style={{ padding: "16px", width: "250px" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Location</InputLabel>
                <Select
                  value={filter.location}
                  onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                >
                  <MenuItem value="Hải Châu">Hải Châu</MenuItem>
                  <MenuItem value="Thanh Khê">Thanh Khê</MenuItem>
                  <MenuItem value="Sơn Trà">Sơn Trà</MenuItem>
                  <MenuItem value="Ngũ Hành Sơn">Ngũ Hành Sơn</MenuItem>
                  <MenuItem value="Liên Chiểu">Liên Chiểu</MenuItem>
                  <MenuItem value="Cẩm Lệ">Cẩm Lệ</MenuItem>
                  <MenuItem value="Hòa Vang">Hòa Vang</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Room Area</InputLabel>
                <Select
                  value={filter.area}
                  onChange={(e) => setFilter({ ...filter, area: e.target.value })}
                >
                  <MenuItem value="12-15">12-15m²</MenuItem>
                  <MenuItem value="16-20">16-20m²</MenuItem>
                  <MenuItem value="20-25">20-25m²</MenuItem>
                  <MenuItem value="25-30">25-30m²</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Max Price ($)</InputLabel>
                <Select
                  value={filter.price}
                  onChange={(e) => setFilter({ ...filter, price: e.target.value })}
                >
                  <MenuItem value="lt1500000">Dưới 1tr5</MenuItem>
                  <MenuItem value="1500000-2000000">1tr5-2tr</MenuItem>
                  <MenuItem value="2000000-3000000">2tr-3tr</MenuItem>
                  <MenuItem value="gt3000000">Hơn 3tr</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: variables.pinkred }}
                onClick={handleApplyFilter}
              >
                Apply Filter
              </Button>
            </div>
          </Popover>
        </div>
      </div>

      <div className="navbar_right">
        {/* Hiển thị tên user khi đã đăng nhập */}
        {user ? (
          <span className="navbar_user_greeting">Hello, {user.name}</span>
        ) : (
          <a href="/login" className="host">Become A Host</a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgray }} />
          {user ? (
            <img
              src={
                user.profileImagePath
                  ? `http://localhost:3001/${user.profileImagePath.replace("public", "")}`
                  : "/assets/default-profile.jpg"
              }
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <Person sx={{ color: variables.darkgray }} />
          )}
        </button>

        {dropdownMenu && (
          <div className="navbar_right_accountmenu">
            {!user ? (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/register">Sign In</Link>
              </>
            ) : user.role === 'host' ? (
              <>
                <Link to="/info">Info Management</Link>
                <Link to="/create-listing">Create Listing</Link>
                <Link to="/contracts">Contract List</Link>
                <Link to="/paybill">Pay Bill</Link>
                <Link to="/list-room">List Room</Link>
                
                <Link
                  to="/login"
                  onClick={() => dispatch(setLogout())}
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link to="/info">Info Management</Link>
                <Link to="/my-contracts">My Contracts</Link>
                <Link to="/my-payments">Payment History</Link>
                <Link to="/paybill-renter">Pay Bill</Link>
                <Link
                  to="/login"
                  onClick={() => dispatch(setLogout())}
                >
                  Log Out
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
