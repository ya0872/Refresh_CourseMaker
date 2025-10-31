import { Link } from 'react-router-dom';

export const Login = () => {
    return(
        <div className='Login'>
            <h2>Login Page</h2>
            <nav>
                <Link to="/">Go to HomePage</Link>
            </nav>
        </div>
    )
}

export default Login;