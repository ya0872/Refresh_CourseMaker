import { Link, useNavigate } from 'react-router-dom'
import './HomeScreen.css'

function HomeScreen() {
    const navigate = useNavigate();
    const login = () => {
    navigate('/');
    };
    return(
        <div className="home">
        
      <Link to="/coupon" className="coupon">
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
  )
}
export default HomeScreen