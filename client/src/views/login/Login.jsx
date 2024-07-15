import { useState, useEffect } from 'react'
import loginService from '../../services/login'
import LoginForm from '../../components/LoginForm'
import Alert from '../../components/Alert'

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [alertType, setAlertType] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      ) 

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Error: Wrong credentials')
      setAlertType('alert-error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return(
      <div>
        <Alert message={errorMessage} type={alertType} />
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
      </div>
    )
  }

  return (
    <div>
      {user === null ?
        loginForm() :
        <div>
          <p>{user.username} logged-in</p>
        </div>
      }
    </div>
  )
}

export default Login
