import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap'
import { getMemberships, createMembership, deleteMembership } from '../services/api'

function MembershipsPage() {
  const { user } = useSelector((state) => state.auth)

  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    userId: '',
    type: '',
    startDate: '',
    expiryDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await getMemberships()
      setMemberships(res.data)
    } catch (err) {
      setError('Failed to load memberships')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await createMembership(createForm)
      setMemberships([...memberships, res.data])
      setShowCreateModal(false)
      setCreateForm({ userId: '', type: '', startDate: '', expiryDate: '' })
    } catch (err) {
      setError('Failed to create membership')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMembership(id)
      setMemberships(memberships.filter(m => m.id !== id))
    } catch (err) {
      setError('Failed to delete membership')
    }
  }

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date()

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Memberships</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>+ Add Membership</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {memberships.length === 0 ? (
        <Alert variant="info">No memberships found.</Alert>
      ) : (
        <Row>
          {memberships.map(membership => (
            <Col key={membership.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{membership.type}</Card.Title>
                    <Badge bg={isExpired(membership.expiryDate) ? 'danger' : 'success'}>
                      {isExpired(membership.expiryDate) ? 'Expired' : 'Active'}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted mb-1">
                    <small>👤 User #{membership.userId}</small>
                  </Card.Text>
                  <Card.Text className="text-muted mb-1">
                    <small>📅 Start: {new Date(membership.startDate).toLocaleDateString()}</small>
                  </Card.Text>
                  <Card.Text className="text-muted mb-3">
                    <small>📅 Expiry: {new Date(membership.expiryDate).toLocaleDateString()}</small>
                  </Card.Text>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(membership.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Membership Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                value={createForm.userId}
                onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
              >
                <option value="">Select type...</option>
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
                <option value="Student">Student</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={createForm.startDate}
                onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                value={createForm.expiryDate}
                onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate}>Create Membership</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MembershipsPage
