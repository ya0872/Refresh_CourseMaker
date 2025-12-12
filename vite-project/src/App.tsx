import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Login } from './LoginSystem/Login';
import { NewEntry } from './LoginSystem/NewEntry';
import  HomeScreen  from './HomeScreen'
import CouponReward from  './coupon_reward';
import Admin from './coupon_admin'; 


const HomePage = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <h1>
        <nav>
          <Link to="/login">Go to Login</Link>
        </nav>
        <nav>
          <Link to="/HomeScreen">Go to HomesScreen</Link>
        </nav>
        <nav>
          <Link to="/couponreward">Go to CouponReward</Link>
        </nav>
        <nav>
          <Link to="/couponadmin">Go to Admin Page</Link> 
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
        <Route path="/" element={<Navigate to="/newEntry" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newEntry" element={<NewEntry />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/couponreward" element={<CouponReward />} />
        <Route path="/couponadmin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
