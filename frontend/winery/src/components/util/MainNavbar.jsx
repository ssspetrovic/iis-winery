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

const MainNavbar = () => {
  const { auth, logout } = useAuth();
  const { username, role } = auth || {};
  const [isOpen, setIsOpen] = useState(false);
  // const [redirectPath, setRedirectPath] = useState("");

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
              <NavItem className="mx-md-2">
                <NavLink href="/browse" style={{ color: "white" }}>
                  Browse
                </NavLink>
              </NavItem>
              <div className="mx-md-2">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret style={{ color: "white" }}>
                    {username}
                  </DropdownToggle>
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
              </div>
              <NavItem className="mx-md-2">
                <NavLink href="/cart">
                  <i
                    className="fa fa-shopping-cart"
                    style={{ color: "white" }}
                  ></i>
                </NavLink>
              </NavItem>
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
      </Collapse>
    </Navbar>
  );
};

export default MainNavbar;
