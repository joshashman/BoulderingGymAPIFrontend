import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import LoginPage from './LoginPage'

const createTestStore = () => configureStore({
  reducer: { auth: authReducer },
  preloadedState: {
    auth: {
      isAuthenticated: false,
      user: null,
      token: null
    }
  }
})

describe('LoginPage', () => {
  test('renders email and password fields', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  test('renders login button', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('renders register link', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  test('updates email field when typed in', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    expect(emailInput.value).toBe('test@test.com')
  })

  test('updates password field when typed in', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    expect(passwordInput.value).toBe('Password123!')
  })
})