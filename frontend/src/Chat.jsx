import React from 'react'
import { useState, useEffect } from 'react'
import { Dropdown } from './Dropdown'
import { nanoid } from 'nanoid'

export const Chat = () => {
    const [input , setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [model, setModel] = React.useState('gpt-4-0314');
    const [userApiKey, setUserApiKey] = useState('' || localStorage.getItem('userApiKey'))
    
    const handleModelChange = (event) => {
      setModel(event.target.value);
    };

    useEffect(() => {
      localStorage.setItem('userApiKey', userApiKey);
    }, [userApiKey]);

    const handleSubmit =  (e) => {
        e.preventDefault();

        if ((input === "") || (userApiKey === "")) {
          return;
        }
        
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
          body: JSON.stringify({
            model: model,
            messages: messages,
            userApiKey: userApiKey
          })
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
        <p>Api Key</p>
        <input type="text" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} placeholder="Enter your api key"/>
        <Dropdown 
          key={nanoid()}
          label="Model" 
          value={model}
          options={[
            { value: "gpt-4-0314", label: "GPT-4" },
            { value: "gpt-3.5-turbo", label: "Chat-GPT" }
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
