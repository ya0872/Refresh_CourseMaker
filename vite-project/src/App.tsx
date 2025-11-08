import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Login } from './Login';

const HomePage = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <h1>
        <nav>
          <Link to="/login">Go to Login</Link>
        </nav>
      </h1>
    </div>
  );
}

function App() {
  // アプリケーションのルーティング設定
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homePage" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
