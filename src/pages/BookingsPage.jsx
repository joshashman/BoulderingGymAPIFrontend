import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap'
import { getBookings, createBooking, deleteBooking, getSessions } from '../services/api'

function BookingsPage() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'Admin'

  const [bookings, setBookings] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, sessionsRes] = await Promise.all([getBookings(), getSessions()])
      setBookings(bookingsRes.data)
      setSessions(sessionsRes.data)
    } catch (err) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  // Filter to only show current user's bookings unless admin
  const visibleBookings = isAdmin ? bookings : bookings.filter(b => b.userId === user?.id)

  const getSession = (sessionId) => sessions.find(s => s.id === sessionId)

  const handleCreate = async () => {
    try {
      const session = getSession(parseInt(selectedSessionId))
      const res = await createBooking({
        userId: user?.id,
        sessionId: parseInt(selectedSessionId),
        price: session?.price ?? 0
      })
      setBookings([...bookings, res.data])
      setShowCreateModal(false)
      setSelectedSessionId('')
    } catch (err) {
      setError('Failed to create booking')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id)
      setBookings(bookings.filter(b => b.id !== id))
    } catch (err) {
      setError('Failed to delete booking')
    }
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isAdmin ? 'All Bookings' : 'My Bookings'}</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>+ New Booking</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {visibleBookings.length === 0 ? (
        <Alert variant="info">No bookings found.</Alert>
      ) : (
        <Row>
          {visibleBookings.map(booking => {
            const session = getSession(booking.sessionId)
            return (
              <Col key={booking.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>Session #{booking.sessionId}</Card.Title>
                    {session && (
                      <>
                        <Card.Text className="text-muted mb-1">
                          <small>📅 {new Date(session.startTime).toLocaleDateString()}</small>
                        </Card.Text>
                        <Card.Text className="text-muted mb-1">
                          <small>🕐 {new Date(session.startTime).toLocaleTimeString()} — {new Date(session.endTime).toLocaleTimeString()}</small>
                        </Card.Text>
                        <Card.Text className="text-muted mb-2">
                          <small>📝 {session.description}</small>
                        </Card.Text>
                      </>
                    )}
                    <Card.Text><strong>£{booking.price}</strong></Card.Text>
                    {/* Users can delete own bookings, admins can delete any */}
                    {(isAdmin || booking.userId === user?.id) && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(booking.id)}>
                        Cancel Booking
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      {/* Create Booking Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book a Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select a Session</Form.Label>
              <Form.Select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
              >
                <option value="">Choose a session...</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {new Date(session.startTime).toLocaleDateString()} — {session.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate} disabled={!selectedSessionId}>Book</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default BookingsPage