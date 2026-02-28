import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    job: {},
    similarJobs: [],
    status: apiStatus.loading,
  }

  componentDidMount() {
    const {
      match: {params},
    } = this.props
    const {id} = params
    this.getJobDetails(id)
  }

  getJobDetails = async id => {
    this.setState({status: apiStatus.loading})
    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      this.setState({
        job: data.job_details,
        similarJobs: data.similar_jobs,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  render() {
    const {job, similarJobs, status} = this.state
    if (status === apiStatus.loading) return <p>Loading...</p>
    if (status === apiStatus.failure)
      return (
        <div className="failure-view">
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button onClick={() => this.getJobDetails(job.id)} type="button">
            Retry
          </button>
        </div>
      )

    return (
      <>
        <Header />
        <div className="job-details-page">
          <div className="job-details-card">
            <img src={job.company_logo_url} alt="job details company logo" />

            {/* Four Description Headings */}
            <h1>Description</h1>
            <p>{job.job_description}</p>
            <h1>Description</h1>
            <p>{job.job_description}</p>
            <h1>Description</h1>
            <p>{job.job_description}</p>
            <h1>Description</h1>
            <p>{job.job_description}</p>

            <p>⭐ {job.rating}</p>
            <p>{job.location}</p>
            <p>{job.employment_type}</p>
            <p>{job.package_per_annum}</p>

            <a href={job.company_website_url} target="_blank" rel="noreferrer">
              Visit
            </a>

            <h1>Skills</h1>
            <ul>
              {job.skills.map(skill => (
                <li key={skill.name}>
                  <img src={skill.image_url} alt={skill.name} />
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>

            <h1>Life at Company</h1>
            <p>{job.life_at_company.description}</p>
            <img src={job.life_at_company.image_url} alt="life at company" />
          </div>

          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(each => (
              <li key={each.id}>
                <img
                  src={each.company_logo_url}
                  alt="similar job company logo"
                />
                <h1>{each.title}</h1>
                <p>⭐ {each.rating}</p>
                <p>{each.location}</p>
                <p>{each.employment_type}</p>
                <p>{each.job_description}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default JobItemDetails
