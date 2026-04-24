import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { loginSuccess } from '../store/slices/authSlice'
import { login } from '../services/api'
import { jwtDecode } from 'jwt-decode'

function LoginPage() {
  // Controlled component state — each input is tied to a state variable
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handles any input change and updates the correct field in formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)
  try {
    const response = await login(formData)
    const decoded = jwtDecode(response.data.token) // Decode JWT to extract user info including role

    // Check if Admin role exists in the roles array, otherwise use first role
    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const roleArray = Array.isArray(roles) ? roles : [roles]
    const role = roleArray.includes('Admin') ? 'Admin' : roleArray[0]

    dispatch(loginSuccess({
    token: response.data.token,
    user: {
      id: decoded.sub,
      email: decoded.email,
      role: role  
    }
}))
    navigate('/dashboard')
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid email or password')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <h2 className="text-center mb-4">Login</h2>

        {/* Show error message if login fails */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </Container>
  )
}

export default LoginPage

