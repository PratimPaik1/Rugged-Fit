import { useState } from 'react'
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from '../features/auth/components/LoadingScreen.jsx';
import { useCart } from '../features/cart/hooks/use.cart.js';
function App() {
  const { handleCurrentUser } = useAuth()
  const { getCart } = useCart()
  const isInitialized = useSelector((state) => state.auth.isInitialized)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    handleCurrentUser()
  }, [])

  useEffect(() => {
    if (user) getCart()
  }, [user])

  if (!isInitialized) {
    return <LoadingScreen />
  }

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer />
    </>
  )
}

export default App
