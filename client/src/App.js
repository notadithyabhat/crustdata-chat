import Sidebar from './components/Sidebar'
import Chat from './components/Chat'

import { useState } from 'react'

export default function App() {
  // Track the collapsed state here
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="h-screen flex overflow-hidden">
      
      {/* 
        Sidebar: width changes based on isCollapsed 
        flex-shrink-0 -> don't shrink beyond set width
        transition-all + duration-300 -> smooth animation
      */}
      <aside
        className={`
          ${isCollapsed ? 'w-16' : 'w-64'} 
          bg-gray-900 text-white flex-shrink-0 
          transition-all duration-300
        `}
      >
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </aside>

      {/*
        The Chat area will take all remaining space 
        because it's a sibling in a flex container
      */}
      <Chat />
    </div>
  )
}

