import React from "react"
import { useState, useEffect } from "react"
import { Dropdown } from "./Dropdown"
import { nanoid } from "nanoid"
import { Range } from "./Range"

export const Chat = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  const [temperature, setTemperature] = useState(
    0.7 || localStorage.getItem("temperature") || 0.7
  )
  const [maxTokens, setMaxTokens] = useState(
    localStorage.getItem("maxTokens") || 50
  )
  const [userApiKey, setUserApiKey] = useState(
    localStorage.getItem("userApiKey") || ""
  )
  const [model, setModel] = React.useState("gpt-4-0314")

  const [clientId, setClientId] = useState("")
  const [messagesHtml, setMessagesHtml] = useState([])
  const messagesContainerRef = React.useRef(null)

  const changeTemperature = (event) => {
    setTemperature(parseFloat(event.target.value))
  }

  const changeModel = (event) => {
    setModel(event.target.value)
  }

  useEffect(() => {
    localStorage.setItem("temperature", temperature)
  }, [temperature])

  useEffect(() => {
    localStorage.setItem("maxTokens", maxTokens)
  }, [maxTokens])

  useEffect(() => {
    localStorage.setItem("userApiKey", userApiKey)
  }, [userApiKey])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (input === "" || userApiKey === "") {
      return
    }

    // Update messages with the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ])
    setInput("")
  }

  useEffect(() => {
    if (messages.length > 0) {
      if (messages[messages.length - 1].role === "user") {
        callApi()
      }
    }
  }, [messages])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const newClientId = nanoid() // Generate a unique clientId using nanoId
    setClientId(newClientId)

    const eventSource = new EventSource(
      `https://chat-gpt-clone-y5ns.onrender.com/events/${newClientId}`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)

      setMessages((prevMessages) => {
        let lastMessage = prevMessages[prevMessages.length - 1]
        let newMessages = prevMessages.slice(0, prevMessages.length - 1)

        if (lastMessage.role === "assistant") {
          let updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + data,
          }
          newMessages.push(updatedMessage)
        } else {
          return [...prevMessages, { role: "assistant", content: data }]
        }
        return newMessages
      })
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const callApi = async () => {
    await fetch("https://chat-gpt-clone-y5ns.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Messages: JSON.stringify(messages),
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        userApiKey: userApiKey,
        clientId: clientId,
        temperature: temperature,
      }),
    })
  }

  useEffect(() => {
    const messagesHtml = messages.map((message, index) => (
      <div
        key={index}
        style={
          message.role === "user"
            ? { backgroundColor: "#1a1a1a" }
            : { backgroundColor: "#242424" }
        }
        className="message"
      >
        <div className="message-body">
          <div className="image-container">
            <img
              src={
                message.role === "user"
                  ? "/avatar.png"
                  : "/apple-touch-icon.png"
              }
              alt="user"
              className="message-image"
            />
          </div>
          <p className="user-message">{message.content}</p>
        </div>
      </div>
    ))

    setMessagesHtml(messagesHtml)
  }, [messages])

  const toggleMenu = () => {
    const menu = document.querySelector(".aside")
    const menu2 = document.querySelector(".aside-wrapper")
    menu.classList.toggle("aside-active")
    menu2.classList.toggle("aside-active")
  }

  return (
    <div className="container">
      <button className="hamburger-menu" onClick={toggleMenu}>
        <span className="hamburger-menu-line">
          <i className="fa-solid fa-bars"></i>
        </span>
      </button>
      <div className="main-content">
        <div className="aside-wrapper">
          <aside className="aside">
            <div className="dropdown">
              <Dropdown
                key={nanoid()}
                label="Model"
                value={model}
                options={[
                  { value: "gpt-4-0314", label: "GPT-4" },
                  { value: "gpt-3.5-turbo", label: "Chat-GPT" },
                ]}
                onChange={changeModel}
              />
            </div>

            <p>Api Key</p>
            <input
              type="password"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="Enter your api key"
            />

            <div className="temperature">
              <p>Temperature</p>
              <Range
                state={temperature}
                handleChange={changeTemperature}
                min={0.1}
                max={1.0}
              />
            </div>
          </aside>
        </div>
        <section className="chat-log">
          <h1>CHAT</h1>
          <div className="messages-container" ref={messagesContainerRef}>
            {messagesHtml}
          </div>

          <form
            action=""
            method="post"
            onSubmit={handleSubmit}
            className="chat-form"
          >
            <input
              type="text"
              name="input"
              placeholder="Type your message here"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input type="submit" value="Chat" className="chat-submit" />
          </form>
        </section>
      </div>
    </div>
  )
}
