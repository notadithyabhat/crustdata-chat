import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
// No separate CSS import for Chat.css; we'll use App.css

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Custom renderer for code blocks
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  // Loading indicator component with animated dots
  const LoadingIndicator = () => {
    const [dots, setDots] = useState("");
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <div className="loading">The bot is cooking{dots}</div>;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { sender: "user", text: message };

    // Update chat immediately with user message
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);

    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      // Format chat history for API
      const formattedHistory = updatedChat.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentMessage,
          history: formattedHistory, // Send formatted history
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.answer };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setChat((prevChat) => [
        ...prevChat,
        { sender: "bot", text: "Error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <ReactMarkdown
              components={{
                code: CodeBlock,
                pre: (props) => <div {...props} />,
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <LoadingIndicator />
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Ask a question about Crustdata's APIs..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
