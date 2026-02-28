import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
    />
    <h1>Page Not Found</h1>
    <p>The page you requested could not be found.</p>
    <Link to="/">
      <button type="button">Home</button>
    </Link>
  </div>
)

export default NotFound
