import React, { useState } from "react";
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
  const { username } = auth || {};
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar color="light" expand="md" className="sticky-top">
      <div className="mx-md-3">
        <NavbarBrand href="/">Winery</NavbarBrand>
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
                  <DropdownToggle nav caret>
                    {username}
                  </DropdownToggle>
                </div>
                <DropdownMenu>
                  <DropdownItem>
                    <NavLink href={`/admin-profile/${username}`}>
                      Profile
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink href="/" onClick={() => logout()}>
                      Log out
                    </NavLink>
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
