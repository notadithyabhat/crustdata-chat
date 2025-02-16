import React, { useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const ChatInput = ({ message, setMessage, sendMessage, isLoading, handleKeyPress }) => {
  // Ref to dynamically resize the textarea and focus it on container clicks
  const textAreaRef = useRef(null)

  // Automatically resize to fit content up to a maximum, then scroll
  const handleChange = (e) => {
    setMessage(e.target.value)
    
    if (textAreaRef.current) {
      // Reset height to auto to measure correct scrollHeight
      textAreaRef.current.style.height = 'auto'
      // Dynamically set the height based on scrollHeight
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  // Make the entire container clickable to focus the text area
  const handleContainerClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  return (
    <div className="border-t border-gray-700 p-4 bg-secondary">
      {/* 
        items-start so that the multiline textarea grows downward smoothly
      */}
      <div className="max-w-5xl mx-auto flex items-start gap-2">
        
        {/* 
          The clickable container. 
          onClick => focuses the text area
        */}
        <div
          className="relative flex-1 cursor-text"
          onClick={handleContainerClick}
          role="button"
          tabIndex={0} // so it can be focusable for accessibility
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
                       bg-accent text-white  /* Ensures strong contrast */
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
