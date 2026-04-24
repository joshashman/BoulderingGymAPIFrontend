import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap'
import { getAttempts, getBookings, getLikes, getMemberships } from '../services/api'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'Admin'

  const [attempts, setAttempts] = useState([])
  const [bookings, setBookings] = useState([])
  const [likes, setLikes] = useState([])
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attemptsRes, bookingsRes, likesRes] = await Promise.all([
          getAttempts(),
          getBookings(),
          getLikes(),
        ]) // Fetch all data in parallel for faster loading

        setAttempts(attemptsRes.data)
        setBookings(bookingsRes.data)
        setLikes(likesRes.data)

        // Only fetch memberships if admin
        if (isAdmin) {
          const membershipsRes = await getMemberships()
          setMemberships(membershipsRes.data)
        }
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAdmin])

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">{error}</Alert>
    </Container>
  )

  // Filter data to only show current user's data
  const myAttempts = attempts.filter(a => a.userId === user?.id).slice(0, 5)
  const myBookings = bookings.filter(b => b.userId === user?.id).slice(0, 5)
  const myLikes = likes.filter(l => l.userId === user?.id)

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Welcome back, {user?.email}</h2>

      <Row className="mb-4">
        {/* Recent Route Attempts */}
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Header><strong>Recent Route Attempts</strong></Card.Header>
            <Card.Body>
              {myAttempts.length === 0 ? (
                <p className="text-muted">No attempts yet</p>
              ) : (
                myAttempts.map(attempt => (
                  <div key={attempt.id} className="mb-2 d-flex justify-content-between">
                    <span>Route #{attempt.climbingRouteId}</span>
                    <Badge bg={attempt.completed ? 'success' : 'secondary'}>
                      {attempt.completed ? 'Completed' : 'Attempted'}
                    </Badge>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Bookings */}
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Header><strong>My Bookings</strong></Card.Header>
            <Card.Body>
              {myBookings.length === 0 ? (
                <p className="text-muted">No bookings yet</p>
              ) : (
                myBookings.map(booking => (
                  <div key={booking.id} className="mb-2 d-flex justify-content-between">
                    <span>Session #{booking.sessionId}</span>
                    <span className="text-muted">£{booking.price}</span>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Liked Routes */}
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Header><strong>Liked Routes</strong></Card.Header>
            <Card.Body>
              {myLikes.length === 0 ? (
                <p className="text-muted">No liked routes yet</p>
              ) : (
                myLikes.map(like => (
                  <div key={like.id} className="mb-2">
                    <span>Route #{like.climbingRouteId}</span>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin only section */}
      {isAdmin && (
        <>
          <h4 className="mb-3">Admin Overview</h4>
          <Row>
            <Col md={6} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Header><strong>Total Memberships</strong></Card.Header>
                <Card.Body>
                  <h1 className="text-center">{memberships.length}</h1>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Header><strong>All Bookings Overview</strong></Card.Header>
                <Card.Body>
                  <h1 className="text-center">{bookings.length}</h1>
                  <p className="text-center text-muted">Total bookings in system</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default DashboardPage