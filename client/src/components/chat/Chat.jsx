// client/src/components/Chat.jsx
import { useState, useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

function createShortTitle(text, maxLen = 30) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.substring(0, maxLen).replace(/\s+$/, '') + '...';
}

export default function Chat() {
  const [input, setInput] = useState('');
  
  // Access store
  const {
    chats,
    messages,
    currentChatId,
    fetchChats,
    loadChat,
    newChat,
    addMessage,
    renameChat,
    loadingByChat,
    setChatLoading
  } = useChatStore();

  // If the active chat is loading
  const isLoadingForThisChat = loadingByChat[currentChatId] === true;

  useEffect(() => {
    (async () => {
      await fetchChats();
      if (!currentChatId) {
        if (chats.length > 0) {
          await loadChat(chats[0].id);
        } else {
          const chatId = await newChat();
          if (chatId) await loadChat(chatId);
        }
      }
    })();
    // Once on mount
  }, []);

  // Identify which chat is active
  const activeChat = chats.find((c) => c.id === currentChatId);

  // Send a new message to the chat
  const sendMessage = async () => {
    if (!input.trim()) return;

    const chatIdUsed = currentChatId; 
    if (!chatIdUsed) return;

    // Mark that chat as loading
    setChatLoading(chatIdUsed, true);

    // 1) Save user's message
    await addMessage({ text: input, isBot: false }, chatIdUsed);
    const userText = input;
    setInput('');

    // 2) If it’s "New Chat," rename
    if (activeChat && activeChat.title === 'New Chat') {
      const shortTitle = createShortTitle(userText, 30);
      await renameChat(chatIdUsed, shortTitle);
    }

    try {
      // 3) Make the request to the AI
      const formattedHistory = messages
        .concat({ role: 'user', content: userText })
        .map((m) => ({
          role: m.role || (m.isBot ? 'assistant' : 'user'),
          content: m.content || m.text
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText, history: formattedHistory })
      });
      const data = await response.json();

      // 4) Add the bot’s answer
      await addMessage({ text: data.answer, isBot: true }, chatIdUsed);
    } catch (error) {
      console.error(error);
      await addMessage({ text: 'Error processing your request.', isBot: true }, chatIdUsed);
    } finally {
      // Done loading
      setChatLoading(chatIdUsed, false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const isNewChat = messages.length === 0;

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-b from-secondary to-accent overflow-hidden">
      <div className="border-b border-gray-700 p-4 flex items-center justify-center">
        <h2 className="text-xl font-bold text-white">
          {activeChat ? activeChat.title : 'New Chat'}
        </h2>
      </div>

      {isNewChat ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <ChatInput
            message={input}
            setMessage={setInput}
            sendMessage={sendMessage}
            isLoading={isLoadingForThisChat}
            handleKeyPress={handleKeyDown}
            isNewChat
          />
        </div>
      ) : (
        <>
          {/* Chat history */}
          <div className="flex-1 overflow-y-auto h-full max-w-full p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.content || msg.text}
                isBot={msg.role === 'assistant' || msg.isBot}
              />
            ))}
            
            {/* Ephemeral spinner message if this chat is loading */}
            {isLoadingForThisChat && (
              <ChatMessage
                key="loading"
                message=""      // no text
                isBot
                isLoading       // tells ChatMessage to show “The bot is cooking...”
              />
            )}
          </div>

          <ChatInput
            message={input}
            setMessage={setInput}
            sendMessage={sendMessage}
            isLoading={isLoadingForThisChat}
            handleKeyPress={handleKeyDown}
          />
        </>
      )}
    </main>
  );
}
