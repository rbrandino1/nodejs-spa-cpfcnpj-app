import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Docs = props => (
  <tr>
    <td className={props.doc.active ? 'active' : ''}>{props.doc.cpfcnpj}</td>
    <td className={props.doc.active ? 'active' : ''}>{props.doc.type}</td>
    <td className={props.doc.active ? 'active' : ''}>{props.doc.active}</td>
    <td>
      <Link to={'/edit/' + props.doc._id}>Editar</Link>
    </td>
  </tr>
)

class ListDocsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { documents: [] }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/documents')
      .then(response => {
        this.setState({ documents: response.data })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  listDocs() {
    return this.state.documents.map(function(currentItem, i) {
      return <Docs doc={currentItem} key={i}/>
    })
  }

  render() {
    return (
      <div>
        <h3>Listagem de Documentos</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
          <tr>
            <th>CPF/CNPJ</th>
            <th>Tipo</th>
            <th>Ativar\Desativar</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {this.listDocs()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default ListDocsComponent
