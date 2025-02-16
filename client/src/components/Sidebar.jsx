export default function Sidebar() {
  return (
    <div className="sidebar bg-gray-900">
      <div className="p-4 text-primary text-3xl font-bold font-sans border-b border-gray-700"> 
        CrustData Bot
      </div>
      <div className="p-4 border-b border-gray-700">
        <button className="w-full bg-accent hover:bg-opacity-80 text-primary 
                          rounded-lg p-3 transition-all flex items-center gap-2">
          <span className="text-lg">+</span>
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {/* Temporary history placeholder */}
        <div className="text-gray-400 p-2 text-sm">
          Chat history will appear here
        </div>
      </div>
      
      <div className="border-t border-gray-700 p-4">
        <div className="absolute bottom-10 w-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary"></div>
          <div className="text-gray-200 text-sm">Guest User</div>
        </div>
      </div>
    </div>
  )
}