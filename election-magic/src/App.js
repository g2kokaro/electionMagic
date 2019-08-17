import React, { Component } from 'react';
import contractFunctions from './contractFunctions/contractFunctions'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

class App extends Component {
  constructor() {
    super()
    this.state = {
      candidates: [],
      alertType: "",
      message: ""
    }
  }

  async componentDidMount() {
    this.cF = new contractFunctions(this.store)
    this.cF.initialize()
    let candidates = await this.cF.getAllCandidates()

    this.setState((state, props) => {
      return { candidates: candidates }
    })
    this.vote = this.vote.bind(this);
  }

  async vote(id) {
    let result = await this.cF.vote(id)

    this.setState((state, props) => {
      return {
        alertType: result.alertType,
        message: result.message
      }
    })

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

    return (
      <div>
        <h1>Election Magic</h1>
        {candidateTable}
        {alertBox}
      </div>
    )
  }
}

export default App;
