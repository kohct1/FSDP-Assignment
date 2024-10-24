import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OCBCsignup from './OCBCsignup.tsx'
import BookingPage from './BookingPage.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <OCBCsignup />
      </div>
      <div>
        <BookingPage />
      </div>
    </>
  )
}

export default App
