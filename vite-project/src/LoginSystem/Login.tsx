import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../index.css'

export const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const isButtonDisabled = isLoading || !!emailError || !email || !!passwordError || !password;

    const handleCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);
        let isMatch = false;

        try {
            const res = await fetch('http://localhost:4000/api/data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok){
                throw new Error("could not communicate with server")
            }

            const data = await res.json();

            if (data.success === true){
                const receivedUserData = data.data;
                console.log("サーバーから受け取ったデータ:", receivedUserData);
                receivedUserData.forEach((user: any) => {
                    // 入力している state (email, password) と比較
                    if (user.email === email && user.password === password) {
                        isMatch = true; // 一致したら true にする
                        console.log("ユーザーが見つかりました！");
                    }
                });
            }
            else {
                setLoginError("backend did not return the value")
            }

            if (isMatch) {
                navigate('/homePage'); // 一致する人がいた場合だけ移動
            } else {
                setLoginError("メールアドレスまたはパスワードが間違っています");
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

        if (0 === input.length){
            setPasswordError("パスワードを入力してください。");
        }else if (input.length < 10){
            setPasswordError("パスワードは10文字以上です。");
        }else if(/[^a-zA-Z0-9]/.test(input)){
            setPasswordError("パスワードは英数字のみを含みます。");
        }else if(!(/[a-z]/.test(input)&&/[A-Z]/.test(input))){
            setPasswordError("パスワードは大文字と小文字、両方の英字を含みます。");
        }else if(!/\d/.test(input)){
            setPasswordError("パスワードは少なくとも1つの数字を含みます。");
        }else{
            setPasswordError('');
        }
    }

    const handleEmailChange = (email: React.ChangeEvent<HTMLInputElement>) => {
        const input = email.target.value;
        setEmailError(null);
        setEmail(email.target.value);

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)){
            setEmailError("有効なメールアドレスを入力してください。");
        }else{
            setEmailError('');
        }
    }

    return(
        <div className='Login'>
            <h2>Login Page</h2>

            <input type="email"
                name="email"
                autoComplete="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder="username@example.com"
            required/>
            <div style={{ height: '20px', marginTop: '5px' }}>
                {emailError && <p style={{ color: "red", fontSize: "0.8rem", margin: 0 }}>{emailError}</p>}
            </div>
            <input type="password"
                name="password"
                autoComplete="current-password"
                placeholder="password"
                onChange={handlePasswordChange}
            required/>
            <div style={{ height: '20px', marginTop: '5px' }}>
                {passwordError && <p style={{ color: "red", fontSize: "0.8rem", margin: 0 }}>{passwordError}</p>}
            </div>
            <form onSubmit={handleCheckSubmit}>
                <button type="submit" disabled={isButtonDisabled}>
                    {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
            </form>
        </div>
    )
}

export default Login;