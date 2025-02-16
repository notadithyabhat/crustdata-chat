import { useState } from 'react'

import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default function Chat() {
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { sender: 'user', text: message }
    const updatedChat = [...chat, userMessage]
    setChat(updatedChat)
    setMessage('')
    setIsLoading(true)

    try {
      // Example fetch logic
      const formattedHistory = updatedChat.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          history: formattedHistory
        }),
      })

      const data = await response.json()
      const botMessage = { sender: 'bot', text: data.answer }
      setChat((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setChat((prev) => [
        ...prev, 
        { sender: 'bot', text: 'Error processing your request.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-b from-secondary to-accent overflow-hidden">

      <div className="flex-1 overflow-y-auto h-full max-w-full p-4 space-y-4">
        {chat.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg.text}
            isBot={msg.sender === 'bot'}
          />
        ))}
        {isLoading && (
          <ChatMessage message="" isBot isLoading />
        )}
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        handleKeyPress={handleKeyPress}
      />
    </main>
  )
}
