import Sidebar from './components/Sidebar'
import Chat from './components/Chat'

export default function App() {
  return (

    <div className="h-screen flex overflow-hidden">

      {/* 
        Sidebar pinned on the left
        w-64 => fixed width
        flex-shrink-0 => don't shrink
        bg-gray-800 => background
      */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </aside>

      {/* 
        The main Chat area
        occupies remaining space (flex-1)
      */}
      <Chat />
    </div>
  )
}
