import React, {Component} from 'react';
import axios from 'axios';

class EditDocsComponent extends Component {
    constructor(props) {
        super(props)

        this.onChangeDocCpfCnpj = this.onChangeDocCpfCnpj.bind(this)
        this.onChangeDocActive = this.onChangeDocActive.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            cpfcnpj: '',
            active: true
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/documents/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    cpfcnpj: response.data.cpfcnpj,
                    active: response.data.active
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeDocCpfCnpj(e) {
        this.setState({
            cpfcnpj: e.target.value
        });
    }

    onChangeDocActive(e) {
        this.setState({
            active: !this.state.active
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            cpfcnpj: this.state.cpfcnpj,
            active: this.state.active
        };

        axios.put('http://localhost:3001/api/documents/' + this.props.match.params.id, obj)
            .then(res => console.log(res.data));

        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <h3 align="center">Editar Documento</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>CPF/CNPJ: </label>
                        <input type="text"
                               className="form-control"
                               value={this.state.cpfcnpj}
                               onChange={this.onChangeDocCpfCnpj}
                        />
                    </div>
                    <div className="form-check">
                        <input className="form-check-input"
                               id="activeCheckbox"
                               type="checkbox"
                               name="activeCheckbox"
                               onChange={this.onChangeDocActive}
                               checked={this.state.active}
                               value={this.state.active}
                        />
                        <label className="form-check-label" htmlFor="activeCheckbox">
                            Ativar/Desativar
                        </label>
                    </div>

                    <br/>

                    <div className="form-group">
                        <input type="submit" value="Salvar" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default EditDocsComponent
