import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css'

export const NewEntry = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const isButtonDisabled = isLoading || !!emailError || !email || !!passwordError || !password;

    const handleSaveData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
        const res = await fetch('http://localhost:4000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await res.json();
        if (data.success) {
            setEmail('');
            setPassword('');
            navigate('/login');
        }
        } catch (err) {
        console.error(err);
        } finally {
        setIsLoading(false);
        }
    };
    
    const handlePasswordChange = (password: React.ChangeEvent<HTMLInputElement>) => {
        const input = password.target.value;
        setPasswordError(null);
        setPassword(password.target.value);

        if (0 === input.length){
            setPasswordError("有効なパスワードを入力してください。");
        }else if (input.length < 10){
            setPasswordError("パスワードは10文字以上である必要があります。");
        }else if(/[^a-zA-Z0-9]/.test(input)){
            setPasswordError("パスワードは英数字のみを含む必要があります。");
        }else if(!(/[a-z]/.test(input)&&/[A-Z]/.test(input))){
            setPasswordError("パスワードは大文字と小文字、\n両方の英字を含む必要があります。");
        }else if(!/\d/.test(input)){
            setPasswordError("パスワードは少なくとも1つの数字を含む必要があります。");
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
        <div className='LoginRoot'>
        <div className='Login'>
            <h2>New Entry</h2>

            <input type="email"
                name="email"
                autoComplete="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder="username@example.com"
            required/>
            <div style={{ height: '20px'}}>
                {emailError && <p>{emailError}</p>}
            </div>
            <input type="password"
                name="password"
                autoComplete="current-password"
                placeholder="password"
                onChange={handlePasswordChange}
            required/>
            <div style={{ height: '20px', marginBottom: '10px' }}>
                {passwordError && <p>{passwordError}</p>}
            </div>
            <form onSubmit={handleSaveData}>
                <button type="submit" disabled={isButtonDisabled}>
                    {isLoading ? '通信中...' : '新規登録'}
                </button>
            </form>
        </div>
        </div>
    )
}

export default NewEntry;