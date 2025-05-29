import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from 'react-router-dom';

function BasicExample() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        {/* Removed Navbar.Brand */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown
              align="end"
              title={
                <Image
                  src="https://www.gravatar.com/avatar?d=mp"
                  roundedCircle
                  width={43}
                  height={43}
                  alt="User"
                />
              }
              id="user-nav-dropdown"
              className="custom-user-dropdown"
            >
              <NavDropdown.Item as={Link} to="/accommodations">
                My Accommodations
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login">
                Log in
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">
                Sign up
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
