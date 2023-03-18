import React from 'react'
import { useState, useEffect } from 'react'
import { Dropdown } from './Dropdown'
import { nanoid } from 'nanoid'

export const Chat = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [clientId, setClientId] = useState('')
  const [model, setModel] = React.useState('gpt-4-0314')
  const [userApiKey, setUserApiKey] = useState('' || localStorage.getItem('userApiKey'))
  const [messagesHtml, setMessagesHtml] = useState([])

  const handleModelChange = (event) => {
    setModel(event.target.value)
  }

  useEffect(() => {
    localStorage.setItem('userApiKey', userApiKey)
  }, [userApiKey])

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((input === "") || (userApiKey === "")) {
      return;
    }

    // Update messages with the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: input },
    ]);
    setInput('')
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (messages[messages.length - 1].role === 'user') {
        callApi()
      }
    }
  }, [messages]);


  useEffect(() => {
    const newClientId = nanoid(); // Generate a unique clientId using nanoId
    setClientId(newClientId);
  
    const eventSource = new EventSource(`http://127.0.0.1:4000/events/${newClientId}`);
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
  
      setMessages((prevMessages) => {
          let lastMessage = prevMessages[prevMessages.length - 1];
          let newMessages = prevMessages.slice(0, prevMessages.length - 1);
  
          if (lastMessage.role === 'assistant') {
            lastMessage.content += data;
            newMessages.push(lastMessage);
          } 
          else {
            return [...prevMessages, { role: 'assistant', content: data }];
          }
          return newMessages;
      });
    };
  
    return () => {
      eventSource.close();
    };
  }, []);

  const callApi = async () => {
    await fetch('http://127.0.0.1:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Messages: JSON.stringify(messages),
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        userApiKey: userApiKey,
        clientId: clientId,
      }),
    })
  }

  useEffect(() => {

    const messagesHtml = messages.map((message, index) => (
      <div key={index} style={message.role === "user"? {backgroundColor: '#1a1a1a'} : {backgroundColor: '#242424'}} className='message'>
        <div className='message-body'>
          <img src={message.role === "user"? "./src/assets/avatar.png" : "./src/assets/apple-touch-icon.png"} alt="user" className='user-image'/>
          <p className='user-message'>{message.content}</p>
        </div>
      </div>
    ))

    setMessagesHtml(messagesHtml)
  }, [messages]);





  return (
    <div className='container'>
      <aside className='aside'>
        <p>Api Key</p>
        <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} placeholder="Enter your api key"/>
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
          {messagesHtml}
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
