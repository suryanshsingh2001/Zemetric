import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SendSMS from './pages/SendSMS'
import Dashboard from './pages/Dashboard'
import ViolationPage  from './pages/Violations'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard  />} />
        <Route path="/send-sms" element={<SendSMS />} />
        <Route path='/violations' element={<ViolationPage />} />
      </Routes>
    </Router>
  )
}

export default App
