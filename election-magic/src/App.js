import React, { Component } from 'react';
import contractFunctions from './contractFunctions/contractFunctions'
import Table from 'react-bootstrap/Table'

class App extends Component {
  async componentDidMount() {
    this.cF = new contractFunctions(this.store)
    this.cF.initialize()
    let candidates = await this.cF.getAllCandidates()

    this.setState((state, props) => {
      return { candidates: candidates }
    })
  }

  render() {
    let candidateRows = null
    if (this.state != null) {
      candidateRows = this.state.candidates.map(function (candidate) {
        return (
          <tr key={candidate.id}>
            <td>{candidate.id}</td>
            <td>{candidate.name}</td>
            <td>{candidate.voteCount}</td>
          </tr>
        )
      })
    }
    return (
      <div>
        <h1>Election Magic</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Vote Count</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              candidateRows
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default App;
