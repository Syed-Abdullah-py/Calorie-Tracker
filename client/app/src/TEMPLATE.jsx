import React, { useState, useEffect } from 'react'
import Card from './components/Card'
import Login from './pages/Login'

function App() {
  const [data, setData] = useState({ Members: [] })

  useEffect(() => {
    fetch("http://192.168.1.16:5000/members")
      .then(res => res.json())
      .then(data => {
        setData(data)
      })
  }, [])

  return (
    <div>
      <Login />
      <h2>Members</h2>
      <ul>
        {data.Members && data.Members.length > 0 ? (
          data.Members.map((member, idx) => (
            <Card key={idx} name={member} />
          ))
        ) : (
          <li>No members found.</li>
        )}
      </ul>
    </div>
    
  )
}

export default App