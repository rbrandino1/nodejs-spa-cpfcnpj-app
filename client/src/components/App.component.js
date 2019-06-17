import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import ListDocsComponent from './List-docs.component'
import CreateDocsComponent from './Create-docs.component'
import EditDocsComponent from './Edit-docs.component'

import 'bootstrap/dist/css/bootstrap.min.css'

class AppComponent extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">CPF/CNPJ</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Documentos</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Novo Documento</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={ListDocsComponent}/>
          <Route path="/create" component={CreateDocsComponent}/>
          <Route path="/edit/:id" component={EditDocsComponent}/>

        </div>
      </Router>
    )
  }
}

export default AppComponent
