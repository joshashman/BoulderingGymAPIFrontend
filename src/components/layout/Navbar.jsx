import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'Admin'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BsNavbar.Brand as={Link} to="/dashboard">🧗 Bouldering Gym</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="navbar-nav" />
        <BsNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {/* Public */}
            <Nav.Link as={Link} to="/climbingroutes">Routes</Nav.Link>

            {/* Logged in users */}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                <Nav.Link as={Link} to="/sessions">Sessions</Nav.Link>
              </>
            )}

            {/* Admin only */}
            {isAdmin && (
              <Nav.Link as={Link} to="/memberships">Memberships</Nav.Link>
            )}
          </Nav>

          {isAuthenticated ? (
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
