import { Link, useNavigate } from 'react-router-dom'
import './HomeScreen.css'

function HomeScreen() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/');
    };
    
    return(
        <div className="home-container">
            <header className="header-band">
                <h1>ホームメニュー</h1>
            </header>

            <div className="home">
                <Link to="/couponreward" className="coupon-reward">
                    特典・クーポン機能
                </Link>

                <Link to="/course-create" className="course-create">
                    コース作成機能
                </Link>

                <Link to="/courses-view" className="course-view">
                    作成したコースの閲覧機能
                </Link>

                <button onClick={login} className="login">
                    ログイン画面に戻る
                </button>
            </div>

            <footer className="footer-band"></footer>
        </div>
    )
}
export default HomeScreen