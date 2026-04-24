import { Alert } from 'react-bootstrap'

// Reusable error display — pass any error message as a prop
function ErrorMessage({ message }) {
  return <Alert variant="danger">{message}</Alert>
}

export default ErrorMessage
