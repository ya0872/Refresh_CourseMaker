import { Routes, Route, Link } from 'react-router-dom';
import { Login } from './Login';

const HomePage = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <nav>
        <Link to="/login">Go to Login</Link>
      </nav>
    </div>
  );
}

function App() {
  // アプリケーションのルーティング設定
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
