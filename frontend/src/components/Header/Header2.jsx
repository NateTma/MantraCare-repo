import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiMenu, BiChevronDown } from "react-icons/bi";
import './Header.css';
import logo from '../../assets/images/logo.png';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const navLinks = [
  { path: '/home', display: 'Home' },
  { path: '/session', display: 'My Sessions', dropdown: true, subLinks: [
    { path: '/sessions/text', display: 'Text Sessions' },
    { path: '/sessions/video', display: 'Video Sessions' },
  ]},
  { path: '/appointment', display: 'Appointment', dropdown: true, subLinks: [
    { path: '/appointments/online', display: 'Online Appointments' },
    { path: '/appointments/in-person', display: 'In-Person Appointments' },
  ]},
  { path: '/forum', display: 'Forum' },
  { path: '/resources', display: 'Blog', dropdown: true, subLinks: [
    { path: '/resources', display: 'Resource' },
    { path: '/myresources', display: 'My Resources' },
    { path: '/create/resources', display: 'Create Resources' },
  ]},
  { path: '/schedule', display: 'Schedule' },
  { path: '/services', display: 'Services' },
 
  { path: '/support', display: 'Support', dropdown: true, subLinks: [
    { path: '#', display: 'Customer Support', supportType: 'Customer' },
    { path: '#', display: 'Crisis Support', supportType: 'Crisis' },
  ]},
  
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setUserRole, setUserName } = useGlobalState();
  const { accessToken } = useGlobalState();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    setAccessToken('');
    setUserRole('');
    setUserName('');
    localStorage.clear();
    navigate('/login');
  };

  const handleSupportClick = async (supportType) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3500/customerAndCrisisSupportSession/type/${supportType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('response', response.status)
      if (response.status === 404) {
        const createResponse = await fetch(`http://localhost:3500/customerAndCrisisSupportSession/create/${supportType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(),
        });

        if (createResponse.ok) {
          const newSession = await createResponse.json();
          console.log('New session created:', newSession);
          navigate(`/support/${newSession.sessionId}`);
        } else {
          console.error('Failed to create new session');
        }
      } else {
        const sessions = await response.json();
        console.log('Existing sessions:', sessions);
        if (sessions.length > 0) {
          const existingSessionId = sessions[0].sessionId;
          navigate(`/support/${existingSessionId}`);
        }
      }
    } catch (error) {
      console.error('Error fetching support sessions:', error);
    } finally {
      setLoading(false);
    }
  };


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <header className="custom-header">
      <div className="custom-container">
        <div className="custom-flex custom-justify-between custom-items-center">
          <div className="custom-logo">
            <p className="custom-logo__text">MantraCare</p>
          </div>
          <nav className={`custom-nav ${menuOpen ? 'custom-nav--open' : ''}`}>
            <ul className="custom-nav__list">
              {navLinks.map((link, index) => (
                <li key={index} className="custom-nav__item">
                  {!link.dropdown ? (
                    <NavLink to={link.path} className="custom-nav__link" onClick={() => setMenuOpen(false)}>
                      {link.display}
                    </NavLink>
                  ) : (
                    <>
                      <button onClick={() => toggleDropdown(index)} className="custom-nav__link custom-nav__dropdown-link">
                        {link.display} <BiChevronDown />
                      </button>
                      <ul className={`custom-dropdown ${dropdownOpen[index] ? 'custom-dropdown--open' : ''}`}>
                        {link.subLinks.map((subLink, subIndex) => (
                          <li key={subIndex} className="custom-dropdown__item">
                            {subLink.supportType ? (
                              <button onClick={() => handleSupportClick(subLink.supportType)} className="custom-dropdown__link">
                                {subLink.display}
                              </button>
                            ) : (
                              <NavLink to={subLink.path} className="custom-dropdown__link" onClick={() => setMenuOpen(false)}>
                                {subLink.display}
                              </NavLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
              <li className="custom-nav__item">
                <NavLink to={`/therapists/profile/${userId}`} className="custom-nav__link" onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="custom-flex custom-items-center custom-gap-4">
            <button onClick={handleLogout} className="custom-btn custom-btn--primary">
              Logout
            </button>
            <BiMenu className="custom-menu-icon" onClick={toggleMenu} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
