import React, { useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const ChatInput = ({
  message,
  setMessage,
  sendMessage,
  isLoading,
  handleKeyPress,
  isNewChat = false // new prop; defaults to false
}) => {
  const textAreaRef = useRef(null)

  const handleChange = (e) => {
    setMessage(e.target.value)
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  // We'll only attach an onClick container if not centered
  // (In center mode, the entire container is effectively the input anyway.)
  const handleContainerClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  // If it's a new chat, we can style differently (centered, bigger, shorter, etc.)
  if (isNewChat) {
    return (
      <div className="w-full max-w-lg px-4">
        <h2 className="text-extrabold text-7xl text-white mb-12 text-left">CrustData Bot</h2>
        {/* Centered single "big" input, similar to a search bar */}
        <div className="relative flex flex-col items-end">
          <textarea
            ref={textAreaRef}
            rows={1}
            placeholder="Ask a question..."
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="
              block w-full resize-none
              bg-accent text-white text-xl
              rounded-full py-4 px-6 mr-12
              focus:outline-none
              focus:ring-2 focus:ring-primary
              placeholder:text-text-secondary
            "
            style={{ minHeight: '3rem', maxHeight: '6rem' }}
          />
          <button
            onClick={sendMessage}
            className="
              bg-primary p-3 rounded-full
              hover:bg-opacity-90 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              absolute -right-5 bottom-2
            "
            disabled={!message.trim() || isLoading}
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    )
  }

  // Regular bottom-anchored input
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
            className="
              block w-full min-h-[40px] max-h-40
              overflow-y-auto resize-none
              bg-accent text-white
              rounded-lg p-4 focus:outline-none
              focus:ring-2 focus:ring-primary
              placeholder:text-text-secondary
            "
          />
        </div>

        <button
          onClick={sendMessage}
          className="
            bg-primary p-3 rounded-lg
            hover:bg-opacity-90 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          disabled={!message.trim() || isLoading}
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
