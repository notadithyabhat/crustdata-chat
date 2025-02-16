import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter
      style={tomorrow}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default function ChatMessage({ message, isBot = false, isLoading = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-4 px-4`}
    >
      <div
        className={`message-bubble max-w-[60%] p-3 rounded-lg
                    ${isBot ? 'bg-accent text-primary ml-2' : 'bg-primary text-white mr-2'}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span>The bot is cooking...</span>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              code: CodeBlock,
              pre: (props) => <div className="my-2" {...props} />
            }}
          >
            {message}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  )
}
