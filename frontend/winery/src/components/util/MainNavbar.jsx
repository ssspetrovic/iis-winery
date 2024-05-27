import { useState } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarBrand,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import { ROLES } from "../auth/Roles";

const MainNavbar = () => {
  const { auth, logout } = useAuth();
  const { username, role } = auth || {};
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isWinemakerLoggedIn = role === "WINEMAKER";

  return (
    <Navbar color="dark" expand="md" className="sticky-top">
      <div className="mx-md-3">
        <NavbarBrand href="/">
          <span style={{ color: "white" }}>Winery</span>
        </NavbarBrand>
      </div>
      <NavbarToggler onClick={toggleNavbar} />

      <Collapse isOpen={isOpen} navbar>
        <div style={{ marginLeft: "auto" }}>
          {username ? (
            <Nav navbar>
              {role == ROLES.CUSTOMER && (
                <NavItem className="mx-md-2">
                  <NavLink href="/profile/wishlist" style={{ color: "white" }}>
                    Wishlist
                  </NavLink>
                </NavItem>
              )}
              {role == ROLES.CUSTOMER && (
                <NavItem className="mx-md-2">
                  <NavLink href="/browse" style={{ color: "white" }}>
                    Browse
                  </NavLink>
                </NavItem>
              )}
              {isWinemakerLoggedIn && (
                <>
                  <NavItem>
                    <NavLink
                      href="/dashboard"
                      className="nav-link"
                      style={{ color: "white" }}
                    >
                      <i className="fas fa-chart-line me-2" />
                      <span>Dashboard</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="/cellar"
                      className="nav-link"
                      style={{ color: "white" }}
                    >
                      <i className="fas fa-wine-bottle me-2" />
                      <span>Cellar</span>
                    </NavLink>
                  </NavItem>
                  <NavItem className="mx-md-2">
                    <NavLink
                      href="/winemaker-order-page"
                      style={{ color: "white" }}
                    >
                      Winemaker Order Page
                    </NavLink>
                  </NavItem>
                </>
              )}
              {role == ROLES.CUSTOMER && (
                <NavItem className="mx-md-2">
                  <NavLink href="/profile/orders" style={{ color: "white" }}>
                    Orders
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          ) : (
            <div className="mx-3">
              <Nav navbar>
                <NavItem>
                  <NavLink href="/login" style={{ color: "white" }}>
                    Log in
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/register" style={{ color: "white" }}>
                    Register
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          )}
        </div>
        {username && (
          <Nav navbar>
            <div className="mx-md-2">
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret style={{ color: "white" }}>
                  {username}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    href={`/${role.toLowerCase()}-profile/${username}`}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => logout()}>Log out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            {role == ROLES.CUSTOMER && (
              <NavItem className="mx-md-2">
                <NavLink href="/profile/cart">
                  <i
                    className="fa fa-shopping-cart"
                    style={{ color: "white" }}
                  ></i>
                </NavLink>
              </NavItem>
            )}
          </Nav>
        )}
      </Collapse>
    </Navbar>
  );
};

export default MainNavbar;
