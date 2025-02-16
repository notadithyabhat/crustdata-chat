import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline'

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  return (
    <div className="h-full flex flex-col relative">
      {/* Top bar with collapse/expand button */}
      <div className="border-b border-gray-700 flex items-center justify-between p-2">
        {!isCollapsed && (
          <div className="text-primary text-2xl font-bold font-sans">
            CrustData Bot
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-accent hover:bg-opacity-80 text-primary rounded-lg p-2"
        >
          {isCollapsed ? (
            <ChevronDoubleLeftIcon className="h-6 w-6 rotate-180" />
          ) : (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {!isCollapsed ? (
        <>
          <div className="p-4 border-b border-gray-700">
            <button
              className="w-full bg-accent hover:bg-opacity-80 text-primary
                         rounded-lg p-3 transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-gray-400 p-2 text-sm">
              Chat history will appear here
            </div>
          </div>

          <div className="border-t border-gray-700 p-4 relative">
            <div className="absolute bottom-10 w-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <div className="text-gray-200 text-sm">Guest User</div>
            </div>
          </div>
        </>
      ) : (
        // Minimized: position the green circle in the center
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-primary"></div>
        </div>
      )}
    </div>
  )
}
