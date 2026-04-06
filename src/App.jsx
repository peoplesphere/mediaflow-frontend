import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;