import React, { Component } from 'react'
import axios from 'axios'

class CreateDocsComponent extends Component {
  constructor(props) {
    super(props)

    this.onChangeDocCpfCnpj = this.onChangeDocCpfCnpj.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      cpfcnpj: '',
      active: true
    }
  }

  onChangeDocCpfCnpj(e) {
    this.setState({
      cpfcnpj: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()

    const newDoc = {
      cpfcnpj: this.state.cpfcnpj,
      active: this.state.active
    }

    axios.post('http://localhost:3001/api/documents/', newDoc)
      .then(res => console.log(res.data))

    this.setState({
      cpfcnpj: '',
      active: true
    })
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Novo Documento</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>CPF/CNPJ: </label>
            <input type="text"
                   className="form-control"
                   value={this.state.cpfcnpj}
                   onChange={this.onChangeDocCpfCnpj}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Salvar" className="btn btn-primary"/>
          </div>
        </form>
      </div>
    )
  }
}

export default CreateDocsComponent
