import React from 'react'
import { useState } from 'react'

export const Chat = () => {
    const [input , setInput] = useState('')
    const [messages, setMessages] = useState([{role: "system", content: "You are ChatGPT"}])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Update messages with the user message
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "user", content: input },
        ]);
      
        const response = await fetch("http://127.0.0.1:4000", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Message": messages,
          },
        });
        const data = await response.json();
      
        // Update messages with the response data from API
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "assistant", content: data },
        ]);
      
        // Clear input field
        setInput("");
        console.log(messages)
      };

  return (
    <form action="" method="post" onSubmit={handleSubmit}>
        <input type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" value="Chat"/>
    </form>
  )
}
