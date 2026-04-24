import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../store/slices/authSlice'
import Navbar from './Navbar'

const createTestStore = (authState) => configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: authState }
})

describe('Navbar', () => {
  test('shows login and register links when not authenticated', () => {
    const store = createTestStore({
      isAuthenticated: false,
      user: null,
      token: null
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  test('shows dashboard and bookings links when authenticated', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'User' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Bookings')).toBeInTheDocument()
    expect(screen.getByText('Sessions')).toBeInTheDocument()
  })

  test('shows memberships link for admin users', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'Admin' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Memberships')).toBeInTheDocument()
  })

  test('does not show memberships link for regular users', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'User' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.queryByText('Memberships')).not.toBeInTheDocument()
  })

  test('shows logout button when authenticated', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: { role: 'User' },
      token: 'fake-token'
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})