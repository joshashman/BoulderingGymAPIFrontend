import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../store/slices/authSlice'
import ProtectedRoute from './ProtectedRoute'

// Helper to create a test store with custom auth state
const createTestStore = (authState) => configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: authState }
})

describe('ProtectedRoute', () => {
  test('renders children when user is authenticated', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'User' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  test('redirects to login when user is not authenticated', () => {
    const store = createTestStore({
      isAuthenticated: false,
      user: null,
      token: null
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  test('redirects to dashboard when user does not have required role', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'User' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="Admin">
            <div>Admin Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  test('renders children when user has required admin role', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'Admin' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="Admin">
            <div>Admin Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})