import React, { useState, useContext, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn }) => {
  const [menu, setMenu] = useState("home");
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();
  const { getTotalCartAmount, url } = useContext(StoreContext);

  // Hover handlers with delay for smooth open/close
  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 150); // small delay to allow cursor move to dropdown
  };

  // Check login status on mount (optional, if you want auto update)
  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${url}/api/users/me`, {}, { withCredentials: true });
        setIsLoggedIn(res.data.success);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [url, setIsLoggedIn]);

  // Logout handler
  const logout = async () => {
    try {
      await axios.post(`${url}/api/users/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setIsHovered(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'>
        <img src={assets.logo} alt='Logo' className='logo' style={{ width: "120px" }} />
      </Link>

      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>Contact Us</a>
      </ul>

      <div className='navbar-right'>
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search food..." />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Cart */}
        <div className='navbar-search-icon'>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt='Cart' />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {/* Auth Buttons or Profile Dropdown with Hover */}
        {!isLoggedIn ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div
            className='navbar-profile'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={assets.profile_icon}
              alt="Profile"
              className='profile-avatar'
            />
            {isHovered && (
              <ul
                className="nav-profile-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <li onClick={() => { navigate('/myorders'); setIsHovered(false); }}>
                  <img src={assets.bag_icon} alt="" /><p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" /><p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
