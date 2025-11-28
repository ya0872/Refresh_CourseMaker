import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './index.css'

export const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setError("backend did not return the value")
            }
        }
        catch (err: any){
            setError(err.message || "communication error was happened.")
            console.error(err);
        }
        finally{
            setIsLoading(false);
        }
    }
    
    return(
        <div className='Login'>
            <h2>Login Page</h2>
            <form onSubmit={handleCheckSubmit}>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'now communicate with server...' : 'go to homePage with server communication'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}

export default Login;