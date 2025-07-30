import './App.css'
import { Transactions } from './components/Transactions'
import { QueryProvider } from './QueryProvider'

function App() {
  return (
    <QueryProvider>
      <div className="bg-gray-200 w-screen min-h-screen flex items-center justify-center">
        <Transactions />
      </div>
    </QueryProvider>
  )
}

export default App
