import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap'
import { getRoutes, createRoute, deleteRoute, getLikes, createLike, deleteLike, getAttempts, createAttempt } from '../services/api'

function ClimbingRoutesPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'Admin'

  const [routes, setRoutes] = useState([])
  const [likes, setLikes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create route modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    location: '', difficulty: '', dateSet: '', stripDate: ''
  })

  // Log attempt modal
  const [showAttemptModal, setShowAttemptModal] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [attemptCompleted, setAttemptCompleted] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const routesRes = await getRoutes()
      setRoutes(routesRes.data)

      if (isAuthenticated) {
        const [likesRes, attemptsRes] = await Promise.all([getLikes(), getAttempts()])
        setLikes(likesRes.data)
        setAttempts(attemptsRes.data)
      }
    } catch (err) {
      setError('Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  // Check if current user has liked a route
  const hasLiked = (routeId) => likes.some(l => l.climbingRouteId === routeId && l.userId === user?.id)
  const getLikeId = (routeId) => likes.find(l => l.climbingRouteId === routeId && l.userId === user?.id)?.id
  const getAttemptCount = (routeId) => attempts.filter(a => a.climbingRouteId === routeId).length

  const handleLike = async (routeId) => {
    try {
      if (hasLiked(routeId)) {
        await deleteLike(getLikeId(routeId))
        setLikes(likes.filter(l => !(l.climbingRouteId === routeId && l.userId === user?.id)))
      } else {
        const res = await createLike({ userId: user?.id, climbingRouteId: routeId })
        setLikes([...likes, res.data])
      }
    } catch (err) {
      setError('Failed to update like')
    }
  }

  const handleOpenAttempt = (routeId) => {
    setSelectedRouteId(routeId)
    setAttemptCompleted(false)
    setShowAttemptModal(true)
  }

  const handleLogAttempt = async () => {
    try {
      const res = await createAttempt({
        userId: user?.id,
        climbingRouteId: selectedRouteId,
        attemptDate: new Date().toISOString(),
        completed: attemptCompleted
      })
      setAttempts([...attempts, res.data])
      setShowAttemptModal(false)
    } catch (err) {
      setError('Failed to log attempt')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteRoute(id)
      setRoutes(routes.filter(r => r.id !== id))
    } catch (err) {
      setError('Failed to delete route')
    }
  }

  const handleCreate = async () => {
    try {
      const res = await createRoute(createForm)
      setRoutes([...routes, res.data])
      setShowCreateModal(false)
      setCreateForm({ location: '', difficulty: '', dateSet: '', stripDate: '' })
    } catch (err) {
      setError('Failed to create route')
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
        <h2>Climbing Routes</h2>
        {isAdmin && (
          <Button variant="success" onClick={() => setShowCreateModal(true)}>+ Add Route</Button>
        )}
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {routes.length === 0 ? (
        <Alert variant="info">No routes available.</Alert>
      ) : (
        <Row>
          {routes.map(route => (
            <Col key={route.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{route.location}</Card.Title>
                    <Badge bg={
                      route.difficulty === 'Hard' ? 'danger' :
                      route.difficulty === 'Medium' ? 'warning' : 'success'
                    }>
                      {route.difficulty}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted mb-1">
                    <small>Set: {new Date(route.dateSet).toLocaleDateString()}</small>
                  </Card.Text>
                  <Card.Text className="text-muted mb-3">
                    <small>Strip: {new Date(route.stripDate).toLocaleDateString()}</small>
                  </Card.Text>
                  <div className="d-flex gap-2 flex-wrap">
                    {isAuthenticated && (
                      <>
                        <Button
                          variant={hasLiked(route.id) ? 'danger' : 'outline-danger'}
                          size="sm"
                          onClick={() => handleLike(route.id)}
                        >
                          ❤️ {likes.filter(l => l.climbingRouteId === route.id).length}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleOpenAttempt(route.id)}
                        >
                          🧗 {getAttemptCount(route.id)} Attempts
                        </Button>
                      </>
                    )}
                    {isAdmin && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(route.id)}>
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

      {/* Log Attempt Modal */}
      <Modal show={showAttemptModal} onHide={() => setShowAttemptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Attempt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="checkbox"
            label="Did you complete the route?"
            checked={attemptCompleted}
            onChange={(e) => setAttemptCompleted(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttemptModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleLogAttempt}>Log Attempt</Button>
        </Modal.Footer>
      </Modal>

      {/* Admin Create Route Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Route</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={createForm.location}
                onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select
                value={createForm.difficulty}
                onChange={(e) => setCreateForm({ ...createForm, difficulty: e.target.value })}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date Set</Form.Label>
              <Form.Control
                type="date"
                value={createForm.dateSet}
                onChange={(e) => setCreateForm({ ...createForm, dateSet: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Strip Date</Form.Label>
              <Form.Control
                type="date"
                value={createForm.stripDate}
                onChange={(e) => setCreateForm({ ...createForm, stripDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate}>Create Route</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ClimbingRoutesPage