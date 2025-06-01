import React, { useState } from 'react'
import '../css/Login.css'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const addr = "https://smabdullah.pythonanywhere.com/login"
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(addr, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/home', { state: data.user });
      } else {
        setMessage(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setMessage('Login or Password is incorrect.')
    }
  }

  return (
    <div className='container-fluid'>
      <form onSubmit={handleSubmit} className='login-form'>
        <h1>Login</h1>  
        <hr />
        <div className='mb-2'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='mb-2'>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit</button>
        <p>{message}</p>

        {/* Sign Up Message */}
        <hr />
        <p className="signup-link">
          Don't have an account? 
          <Link to="/Signup"> Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
