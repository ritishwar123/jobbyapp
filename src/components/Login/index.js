import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    this.setState({showError: false})

    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    const jwtToken = data.jwt_token

    if (response.ok === true) {
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({
        errorMsg: data.error_msg,
        showError: true,
      })
    }
  }

  render() {
    const {username, password, errorMsg, showError} = this.state

    return (
      <div className="bg-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />

          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="input-container">
              <label htmlFor="username" className="label">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="input-field"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
            </div>

            <div className="input-container">
              <label htmlFor="password" className="label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            {showError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
