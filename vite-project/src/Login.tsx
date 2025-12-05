import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './index.css'

export const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);

        try {
            const res = await fetch('http://localhost:4000/api/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({message: "server communication test"})
            });

            if (!res.ok){
                throw new Error("could not communicate with server")
            }

            const data = await res.json();

            if (data.success === true){
                navigate('/homePage')
            }
            else {
                setLoginError("backend did not return the value")
            }
        }
        catch (err: any){
            setLoginError(err.message || "communication error was happened.")
            console.error(err);
        }
        finally{
            setIsLoading(false);
        }
    }
    
    const handlePasswordChange = (password: React.ChangeEvent<HTMLInputElement>) => {
        const input = password.target.value;
        setPasswordError(null);
        setPassword(password.target.value);

        if (0 === input.length) return;

        if (input.length < 10){
            setPasswordError("パスワードは10文字以上である必要があります。");
        }else if(!/[a-zA-Z0-9]/.test(input)){
            setPasswordError("パスワードは英数字のみを含む必要があります。");
        }else if(!(/[a-z]/.test(input)&&/[A-Z]/.test(input))){
            setPasswordError("パスワードは大文字と小文字、両方の英字を含む必要があります。");
        }else if(!/\d/.test(input)){
            setPasswordError("パスワードは少なくとも1つの数字を含む必要があります。");
        }else{
            setPasswordError('');
        }
    }

    return(
        <div className='Login'>
            <h2>Login Page</h2>

            <input type="email"
                name="email"
                autoComplete="email" 
                value={email}
                onChange={(email) => setEmail(email.target.value)}
                placeholder="username@example.com"
            required/>
            <br/>
            <input type="password"
                name="password"
                autoComplete="current-password"
                placeholder="password"
                onChange={handlePasswordChange}
            required/>
            <div style={{ height: '20px', marginTop: '5px' }}>
                {passwordError && (
                    <p style={{ color: "red", fontSize: "0.8rem", margin: 0 }}>
                        {passwordError}
                    </p>
                )}
            </div>
            <form onSubmit={handleCheckSubmit}>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'now communicate with server...' : 'go to homePage with server communication'}
                </button>
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
            </form>
        </div>
    )
}

export default Login;