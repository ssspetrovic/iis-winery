import React, { useEffect, useState } from "react";
import { ROLES } from "../auth/Roles";
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavLink as RSNavLink } from 'reactstrap';
import useAuth from "../../hooks/useAuth";

const NavigationBar = () => {
    const { auth } = useAuth();
    const [selectedItem, setSelectedItem] = useState('');
    const { username, role } = auth || {};
    const [isOpen, setIsOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState("");
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const isWinemakerLoggedIn = role === ROLES.WINEMAKER;

    // Render the navigation bar only if the winemaker is logged in
    if (!isWinemakerLoggedIn) {
        return null;
    }
  
    return (
      <Navbar color="light" expand="md" className="sidebar">
        <Nav vertical className={`sidebar${isOpen ? ' open' : ''}`}>
                <NavItem>
                    <NavLink to="/dashboard" className="nav-link" onClick={() => handleItemClick('dashboard')}>
                        <span className={selectedItem === 'dashboard' ? 'selected' : ''}>Dashboard</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/cellar" className="nav-link" onClick={() => handleItemClick('cellar')}>
                        <span className={selectedItem === 'cellar' ? 'selected' : ''}>Cellar</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/materials" className="nav-link" onClick={() => handleItemClick('materials')}>
                        <span className={selectedItem === 'materials' ? 'selected' : ''}>Materials</span>
                    </NavLink>
                </NavItem>
            </Nav>
      </Navbar>
      );
};

export default NavigationBar;
