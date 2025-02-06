import { useState } from 'react'
import './LogIn.css'

function LogIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        // Handle login logic here
        console.log('Username:', username)
        console.log('Password:', password)
    }

    return (
        <div className="login-page">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LogIn