import React, { Component } from 'react';
import contractFunctions from './contractFunctions/contractFunctions'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

class App extends Component {
  constructor() {
    super()
    this.state = {
      candidates: [],
      alertType: "",
      message: "",
      userIsAdmin: false,
      newCandidate: "",
      newVoter: ""
    }
    this.cF = new contractFunctions()
    this.cF.initialize()
  }

  async componentDidMount() {
    this.loadCandidates()
    let userIsAdmin = await this.cF.isUserAdmin()
    this.setState(() => {
      return { userIsAdmin: userIsAdmin }
    })
  }

  async loadCandidates() {
    let candidates = await this.cF.getAllCandidates()
    this.setState((state, props) => {
      return { candidates: candidates }
    })
  }

  async vote(id) {
    let result = await this.cF.vote(id)
    this.setState((state, props) => {
      return {
        alertType: result.alertType,
        message: result.message
      }
    })
    if (result.alertType === "success") {
      this.loadCandidates()
    }
  }

  updateNewCandidate = (e) => {
    this.setState({ newCandidate: e.target.value })
  }

  updateNewVoter = (e) => {
    this.setState({ newVoter: e.target.value })
  }

  render() {
    let candidateTable = (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>)

    if (this.state.candidates.length !== 0) {
      candidateTable = <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Vote Count</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.state.candidates.map(candidate => {
            return (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
                <td><Button variant="primary" onClick={() => this.vote(candidate.id)}>Vote</Button></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    }
    let alertBox
    if (this.state.alertType !== "") {
      alertBox = (
        <Alert variant={this.state.alertType} onClose={() => this.setState((state, props) => {
          return { alertType: "" }
        })} dismissible>
          <p>
            {this.state.message}
          </p>
        </Alert>
      )
    }

    let adminPanel
    if (this.state.userIsAdmin) {
      adminPanel = (
        <Form>
          <Form.Group>
            <Form.Control type="text" value={this.state.newCandidate} onChange={this.updateNewCandidate} placeholder="Enter the new candidate's name" />
            <Button variant="primary" onClick={() => this.cF.addCandidate(this.state.newCandidate)}>
              Add Candidate
            </Button>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" value={this.state.newVoter} onChange={this.updateNewVoter} placeholder="Enter the new voter's address" />
            <Button variant="primary" onClick={() => this.cF.addVoter(this.state.newVoter)}>
              Add Voter
            </Button>
          </Form.Group>
        </Form>
      )
    }
    return (
      <div>
        <h1>Election Magic</h1>
        {adminPanel}
        {candidateTable}
        {alertBox}
      </div>
    )
  }
}

export default App;
