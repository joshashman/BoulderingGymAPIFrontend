import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap'
import { getSessions, createSession, deleteSession } from '../services/api'

function SessionsPage() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'Admin'

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    instructorId: '',
    maxCapacity: '',
    startTime: '',
    endTime: '',
    description: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await getSessions()
      setSessions(res.data)
    } catch (err) {
      setError('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await createSession(createForm)
      setSessions([...sessions, res.data])
      setShowCreateModal(false)
      setCreateForm({ instructorId: '', maxCapacity: '', startTime: '', endTime: '', description: '' })
    } catch (err) {
      setError('Failed to create session')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSession(id)
      setSessions(sessions.filter(s => s.id !== id))
    } catch (err) {
      setError('Failed to delete session')
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
        <h2>Coaching Sessions</h2>
        {isAdmin && (
          <Button variant="success" onClick={() => setShowCreateModal(true)}>+ Add Session</Button>
        )}
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {sessions.length === 0 ? (
        <Alert variant="info">No sessions available.</Alert>
      ) : (
        <Row>
          {sessions.map(session => (
            <Col key={session.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{session.description}</Card.Title>
                    <Badge bg="primary">{session.maxCapacity} spots</Badge>
                  </div>
                  <Card.Text className="text-muted mb-1">
                    <small>📅 {new Date(session.startTime).toLocaleDateString()}</small>
                  </Card.Text>
                  <Card.Text className="text-muted mb-1">
                    <small>🕐 {new Date(session.startTime).toLocaleTimeString()} — {new Date(session.endTime).toLocaleTimeString()}</small>
                  </Card.Text>
                  <div className="mt-3 d-flex gap-2">
                    {isAdmin && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(session.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Admin Create Session Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="e.g. Beginner Bouldering Class"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructor ID</Form.Label>
              <Form.Control
                type="number"
                value={createForm.instructorId}
                onChange={(e) => setCreateForm({ ...createForm, instructorId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Capacity</Form.Label>
              <Form.Control
                type="number"
                value={createForm.maxCapacity}
                onChange={(e) => setCreateForm({ ...createForm, maxCapacity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={createForm.startTime}
                onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={createForm.endTime}
                onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate}>Create Session</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default SessionsPage