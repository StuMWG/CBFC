import Button from './components/Button'
import './App.css'

function App() {
  return (
   <div>
    <Button color="primary" onClick={() => alert('Hello World')}>
        Click Me!
      </Button>
   </div>
  )
}

export default App
