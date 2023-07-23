import { Link, NavLink } from "react-router-dom";
import { FaPlus, FaShoppingBasket, FaSignOutAlt } from "react-icons/fa";
import { GiHamburgerMenu, GiShoppingCart } from "react-icons/gi";
import { VscSignIn } from "react-icons/vsc";
import { IoHome } from "react-icons/io5";

import "./navbar.css";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import { scrollToTop, toggleMenu } from "../../utils/util";

const Navbar = ({ userRole }) => {
  // Get authentication state and logout function from AuthContextProvider
  const { isAuthenticated, logout } = useAuthValue();

  // Handler for user logout
  const logoutHandler = () => {
    scrollToTop(); // Scroll to the top of the page when logging out
    logout(); // Call the logout function from the AuthContextProvider
  };

  {
    /* Logo section */
  }
  return (
    <nav>
      <div className="logo">
        <Link to="/">
          <h1>Busy Buy</h1>
        </Link>
      </div>

      {/* Navigation links section */}
      <div className="nav-links-container">
        {/* Show different links based on user authentication status */}

        {isAuthenticated ? (
          <>
            <ul>
              <li>
                <NavLink to="/">
                  <IoHome />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders">
                  <FaShoppingBasket />
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className="cart">
                  <GiShoppingCart />
                  Cart
                  {/* <span className="cart-count">12</span> */}
                </NavLink>
              </li>
              {/* Show "Add Product" link only for users with "admin" role */}
              {userRole === "admin" && (
                <li>
                  <NavLink to="/add_product">
                    <FaPlus />
                    Add Product
                  </NavLink>
                </li>
              )}
              <li>
                {/* Log out link */}
                <NavLink to="/" onClick={logoutHandler}>
                  <FaSignOutAlt />
                  LogOut
                </NavLink>
              </li>
            </ul>
          </>
        ) : (
          // Show "Sign In" link if the user is not authenticated
          <ul>
            <li>
              <NavLink to="/login">
                <VscSignIn /> Sign In
              </NavLink>
            </li>
          </ul>
        )}
      </div>
      {/* Hamburger menu icon */}
      <div className="menu-bar" onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
