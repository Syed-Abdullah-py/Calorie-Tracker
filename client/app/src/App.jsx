import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Exercise from './pages/Exercise'
import Navbar from './components/Navbar'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/home",
      element: <Homepage/>
    },
    {
      path: "/home/exercise",
      element: <Exercise/>
    },
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App