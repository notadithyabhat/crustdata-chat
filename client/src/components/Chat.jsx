import { useState, useEffect } from 'react'
import useChatStore from '../store/chatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { nanoid } from 'nanoid'

export default function Chat() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    chats,
    messages,
    currentChatId,
    loadChat,
    newChat,
    addMessage,
    updateMessage,
    renameChat
  } = useChatStore()

  // If we have no current chat, pick the first if available; otherwise newChat()
  useEffect(() => {
    if (!currentChatId) {
      if (chats.length > 0) {
        loadChat(chats[0].id)
      } else {
        const chatId = newChat()
        loadChat(chatId)
      }
    }
  }, [currentChatId, chats, loadChat, newChat])

  const sendMessage = async () => {
    if (!input.trim()) return
    setIsLoading(true)

    // Add user message
    const userMessage = {
      id: nanoid(),
      text: input,
      isBot: false,
      isLoading: false,
      timestamp: new Date().toISOString()
    }
    addMessage(userMessage)

    // If the chat is still named "New Chat," rename it to first ~30 chars of the user's question
    const activeChat = chats.find((c) => c.id === currentChatId)
    if (activeChat && activeChat.title === 'New Chat') {
      const shortTitle = createShortTitle(input, 30)
      renameChat(currentChatId, shortTitle)
    }

    // Add placeholder bot message
    const botMessageId = nanoid()
    addMessage({
      id: botMessageId,
      text: '',
      isBot: true,
      isLoading: true,
      timestamp: new Date().toISOString()
    })

    try {
      // Format chat history for the API
      const formattedHistory = messages.map((msg) => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }))

      // Example fetch to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          history: formattedHistory
        }),
      })

      const data = await response.json()

      // Update bot message with the real response
      updateMessage(botMessageId, {
        text: data.answer,
        isLoading: false
      })
    } catch (error) {
      console.error('Chat error:', error)
      updateMessage(botMessageId, {
        text: 'Error processing your request.',
        isLoading: false
      })
    } finally {
      setIsLoading(false)
    }

    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-b from-secondary to-accent overflow-hidden">
      <div className="flex-1 overflow-y-auto h-full max-w-full p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            isBot={msg.isBot}
            isLoading={msg.isLoading}
          />
        ))}
      </div>

      <ChatInput
        message={input}
        setMessage={setInput}
        sendMessage={sendMessage}
        isLoading={isLoading}
        handleKeyPress={handleKeyPress}
      />
    </main>
  )
}

// Helper to shorten the chat title
function createShortTitle(text, maxLen = 30) {
  const trimmed = text.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.substring(0, maxLen) + '...'
}
