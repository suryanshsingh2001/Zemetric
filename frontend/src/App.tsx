import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SendSMS from "./pages/SendSMS";
import Dashboard from "./pages/Dashboard";
import ViolationPage from "./pages/Violations";
import { LogsPage } from "./pages/Logs";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/send-sms" element={<SendSMS />} />
        <Route path="/violations" element={<ViolationPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
