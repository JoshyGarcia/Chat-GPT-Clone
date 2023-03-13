import React from 'react'
import { useState, useEffect } from 'react'

export const Chat = () => {
    const [input , setInput] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {

    }, [messages]);

    const handleSubmit =  (e) => {
        e.preventDefault();
        
        // Update messages with the user message
         setMessages(prevMessages => [
          ...prevMessages,
          { role: "user", content: input }
        ])

        setInput("");
      }

      const callApi = async () => {
        const response = await fetch("http://127.0.0.1:4000", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Messages": JSON.stringify(messages)
          },
        });
        const data = await response.json();
      
        // Update messages with the response data from API
        await setMessages(prevMessages => [
          ...prevMessages,
          { role: "assistant", content: data.content },
        ]);
      
        // // Clear input field
      }

      useEffect(() => {
        if (messages.length > 0) {
          if (messages[messages.length - 1].role === "user") {
            callApi();
          }
        }
      }, [messages]);

  return (
    <div>
      <h1>CHAT</h1>
        <div>
        {messages.map((message, index) => (
          <div key={index}>
            {/* user == message.role? "user": "assistant" */}
            <p>{message.role}</p>
            <p>{message.content}</p>
          </div>
        ))}
        </div>
      <form action="" method="post" onSubmit={handleSubmit}>
          <input type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="Chat"/>
      </form>
    </div>
  )
}
