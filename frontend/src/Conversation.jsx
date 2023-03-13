import React from 'react'
// import state hook
import { useState } from 'react'

export const Conversation = () => {
    // set up state
    const [messages, setMessages] = useState([])
    
    const messagesJSX = messages.map((message) => {
        messageJSX = <div>{message}</div>
        return messageJSX
    })

  return (
    <div>Conversation</div>
  )
}
