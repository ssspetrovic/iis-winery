import React, { useEffect, useState } from "react";
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

const MainNavbar = () => {
  const { auth, logout } = useAuth();
  const { username, role } = auth || {};
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar color="dark" expand="md" className="sticky-top">
      <div className="mx-md-3">
        <NavbarBrand href="/">
          <span style={{ color: "white" }}>Winery</span>
        </NavbarBrand>
      </div>
      <NavbarToggler onClick={toggleNavbar} />

      <Collapse isOpen={isOpen} navbar>
        <div
          style={{
            marginLeft: "auto",
          }}
        >
          {username ? (
            <Nav navbar>
              <UncontrolledDropdown nav inNavbar>
                <div className="mx-md-5">
                  <DropdownToggle nav caret style={{ color: "white" }}>
                    {username}
                  </DropdownToggle>
                </div>
                <DropdownMenu>
                  <DropdownItem>
                    <NavLink
                      href={`/${role.toLowerCase()}-profile/${username}`}
                    >
                      Profile
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink onClick={() => logout()}>Log out</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          ) : (
            <div className="mx-3">
              <Nav navbar>
                <NavItem>
                  <NavLink href="/login">Log in</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/register">Register</NavLink>
                </NavItem>
              </Nav>
            </div>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
};

export default MainNavbar;
