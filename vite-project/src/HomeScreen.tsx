import { Link, useNavigate } from 'react-router-dom'
import './HomeScreen.css'
import { useState } from 'react'

function HomeScreen() {
    const navigate = useNavigate();
    const [todaySteps, setTodaySteps] = useState(0);
    const login = () => {
        navigate('/');
    };
    const addSteps = () => {
        setTodaySteps(todaySteps + 1); 
    };
    
    return(
        <div className="home-container">
            <header className="header-band">
                <h1>ホームメニュー</h1>
            </header>

            <div className="home">

                <div className="step-status-area">
                    <h2>今日の歩数</h2>
                    <div className="step-count">
                        <span className="number">{todaySteps.toLocaleString()}</span>
                        <span className="unit">歩</span>
                    </div>
                    <button 
                        onClick={addSteps} 
                        style={{ marginTop: '10px', padding: '5px 10px' }}
                    >
                        +
                    </button>
                </div>

                <div className="menu-grid">
                    <Link to="/coupon" className="coupon">
                        特典・クーポン
                    </Link>

                    <Link to="/course-create" className="course-create">
                        コース作成
                    </Link>

                    <Link to="/courses-view" className="course-view">
                        作成したコースの閲覧
                    </Link>

                    <button onClick={login} className="login">
                        ログイン画面に戻る
                    </button>
                </div>
            </div>

            <footer className="footer-band"></footer>
        </div>
    )
}
export default HomeScreen