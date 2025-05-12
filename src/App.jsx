import { useState } from 'react'
import Room from './components/Room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto h-screen md:px-4 lg:max-w-4xl xl:max-w-6xl">
        <Room />
      </div>
    </div>
  )
}

export default App
