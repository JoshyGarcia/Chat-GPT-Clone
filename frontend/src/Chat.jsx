import React from 'react'
import { useState, useEffect } from 'react'
import { Dropdown } from './Dropdown'
import { nanoid } from 'nanoid'

export const Chat = () => {
    const [input , setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [model, setModel] = React.useState('gpt-3.5-turbo');
    
    const handleModelChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {

    }, [messages]);

    const handleSubmit =  (e) => {
        e.preventDefault();
      if (input === !"") {
          
          // Update messages with the user message
          setMessages(prevMessages => [
            ...prevMessages,
            { role: "user", content: input }
          ])

          setInput("");
        }
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
    <div className='container'>
      <aside className='aside'>
        <Dropdown 
          key={nanoid()}
          label="Model" 
          value={model}
          options={[
            { value: "gpt-3.5-turbo", label: "chatgpt" },
            { value: "davinci", label: "davinci" },
            { value: "babbage", label: "babbage" }
          ]}
          onChange={handleModelChange}
        />
      </aside>

      <section className='chat-log'>
        <h1>CHAT</h1>
        <div className='messages-container'>
        {messages.map((message, index) => (
          <div key={index} style={message.role === "user"? {backgroundColor: '#1a1a1a'} : {backgroundColor: '#242424'}} className='message'>
            <div className='message-body'>
              <img src={message.role === "user"? "./src/assets/avatar.png" : "./src/assets/apple-touch-icon.png"} alt="user" className='user-image'/>
              <p className='user-message'>{message.content}</p>
            </div>
          </div>
        ))}
        </div>

        <form action="" method="post" onSubmit={handleSubmit} className='chat-form'>
            <input type="text"
                name="input"
                placeholder="Type your message here"
                className='chat-input' 
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <input 
              type="submit" 
              value="Chat"
              className='chat-submit'
            />
        </form>

      </section>
      
    </div>
  )
}
