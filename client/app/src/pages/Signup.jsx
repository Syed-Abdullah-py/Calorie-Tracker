import React, { useState } from 'react'
import '../css/Signup.css'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: '',
    height: '',
    weight: ''
  })

  const addr = "https://smabdullah.pythonanywhere.com/signup"
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }

      if (name === 'password' || name === 'confirmPassword') {
        if (updated.password !== updated.confirmPassword) {
          setPasswordError("Passwords do not match")
        } else {
          setPasswordError('')
        }
      }

      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    try {
      const response = await fetch(addr, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/login')
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      console.error(err)
      setMessage('Server error. Please try again later.')
    }
  }


  return (
    <div className='container-fluid'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <hr />
        <table>
          <tr>
            <td>
              <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
            </td>
            <td>
              <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
            </td>
          </tr>
          
          <tr>
            <td colSpan={2}>
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
            </td>
          </tr>

          <tr>
            <td>
              <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
            </td>
            <td>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
            </td>
          </tr>

          <tr >
            <td colSpan={2}>
              {passwordError && <p className="error-message">{passwordError}</p>}
            </td>
          </tr>
          <tr>
            <td>
              <input type="number" name="age" placeholder="Age" required value={formData.age} onChange={handleChange} />
            </td>
            <td>
              <input type="number" name="height" placeholder="Height (cm)" required value={formData.height} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <input type="number" name="weight" placeholder="Weight (kg)" required value={formData.weight} onChange={handleChange} />
            </td>

            <td>
              <select name="gender" required value={formData.gender} onChange={handleChange}>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </td>
          </tr>
        </table>
        <hr />

        <button type="submit">Sign Up</button>
        <p className='error-message'>{message}</p>
        <p className="signup-link">
          Already have an account? 
          <Link to="/login"> Login</Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
