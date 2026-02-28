import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

class Jobs extends Component {
  state = {
    profile: {},
    jobs: [],
    profileStatus: apiStatus.initial,
    jobsStatus: apiStatus.initial,
    searchInput: '',
    employmentType: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileStatus: apiStatus.loading})
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    if (response.ok) {
      const data = await response.json()
      this.setState({
        profile: data.profile_details,
        profileStatus: apiStatus.success,
      })
    } else {
      this.setState({profileStatus: apiStatus.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsStatus: apiStatus.loading})
    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      this.setState({jobs: data.jobs, jobsStatus: apiStatus.success})
    } else {
      this.setState({jobsStatus: apiStatus.failure})
    }
  }

  toggleEmployment = event => {
    const {employmentType} = this.state
    const {id} = event.target
    const updatedList = employmentType.includes(id)
      ? employmentType.filter(each => each !== id)
      : [...employmentType, id]
    this.setState({employmentType: updatedList}, this.getJobs)
  }

  changeSalary = event => {
    this.setState({salaryRange: event.target.id}, this.getJobs)
  }

  renderProfile = () => {
    const {profileStatus, profile} = this.state
    if (profileStatus === apiStatus.loading) return <p>Loading...</p>
    if (profileStatus === apiStatus.failure)
      return (
        <div className="failure-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <button type="button" onClick={this.getProfile}>
            Retry
          </button>
        </div>
      )
    return (
      <div className="profile-container">
        <img src={profile.profile_image_url} alt="profile" />
        <h1>{profile.name}</h1>
        <p>{profile.short_bio}</p>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobs} = this.state
    if (jobs.length === 0)
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <p>No Jobs Found</p>
        </div>
      )
    return (
      <ul className="jobs-list">
        {jobs.map(job => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="job-link">
            <li className="job-card">
              <div className="job-header">
                <img
                  src={job.company_logo_url}
                  alt="company logo"
                  className="job-logo"
                />
                <div>
                  <h1 className="job-title">{job.title}</h1>
                  <p className="rating">⭐ {job.rating}</p>
                </div>
              </div>

              <div className="job-meta">
                <p>{job.location}</p>
                <p>{job.employment_type}</p>
                <p className="package">{job.package_per_annum}</p>
              </div>

              <hr />

              <h1 className="description-heading">Description</h1>
              <p className="description-text">{job.job_description}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {jobsStatus} = this.state
    if (jobsStatus === apiStatus.loading) return <p>Loading...</p>
    if (jobsStatus === apiStatus.failure)
      return (
        <div className="failure-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <button type="button" onClick={this.getJobs}>
            Retry
          </button>
        </div>
      )
    return this.renderJobsList()
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-page">
          <div className="left-section">
            {this.renderProfile()}

            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    onChange={this.toggleEmployment}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    onChange={this.changeSalary}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="right-section">
            <input
              type="search"
              value={searchInput}
              onChange={e => {
                const {value} = e.target
                this.setState({searchInput: value})
              }}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.getJobs}
            >
              🔍
            </button>

            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
