import './App.css'
import { Transactions } from './components/Transactions'
import { QueryProvider } from './QueryProvider'

function App() {
  return (
    <QueryProvider>
      <div className="">
        <Transactions />
      </div>
    </QueryProvider>
  )
}

export default App
