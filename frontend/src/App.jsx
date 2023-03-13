import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Chat } from './Chat'
import { Conversation } from './Conversation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Conversation />
      <Chat />
    </>
  )
}

export default App
