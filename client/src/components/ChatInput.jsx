import React, { useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const ChatInput = ({ message, setMessage, sendMessage, isLoading, handleKeyPress }) => {
  const textAreaRef = useRef(null)

  // Dynamically resize the textarea to fit content
  const handleChange = (e) => {
    setMessage(e.target.value)
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  // Clicking the container focuses the text area
  const handleContainerClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  return (
    <div className="border-t border-gray-700 p-4 bg-secondary">
      <div className="max-w-5xl mx-auto flex items-start gap-2">
        <div
          className="relative flex-1 cursor-text"
          onClick={handleContainerClick}
          role="button"
          tabIndex={0}
        >
          <textarea
            ref={textAreaRef}
            rows={1}
            placeholder="Ask a question..."
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="block w-full min-h-[40px] max-h-40
                       overflow-y-auto resize-none
                       bg-accent text-white
                       rounded-lg p-4 focus:outline-none
                       focus:ring-2 focus:ring-primary
                       placeholder:text-text-secondary"
          />
        </div>

        <button
          onClick={sendMessage}
          className="bg-primary p-3 rounded-lg hover:bg-opacity-90 
                     transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed"
          disabled={!message.trim() || isLoading}
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
