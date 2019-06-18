# CPF/CNPJ Application

Application for CPF/CNPJ (Brazilian document) validation, containing an interface for records management, with filter possibility, reordering and black list.

## Setup

1. Install [Docker](https://www.docker.com/get-docker).
2. Clone the repository, configure environment variables from the project root directory

  ```sh
  git clone
  cp .env.sample .env
  ```

3. Mongo migration

  ```sh
  $ docker-compose -f ./run/docker-compose.yml up -d mongo
  $ ./mongo-migration.sh
  ```

4. Start the application:

  ```sh
  $ docker-compose -f ./run/docker-compose.yml up
  ```

## API Usage

Schema for GET:
```json
[
    {
        "_id": "5d059981dbd4d123884dcad2",
        "cpfcnpj": "04810688985",
        "type": "cpf",
        "created": "2019-06-15T00:00:00.000Z",
        "active": true
    }
]
```

Schema for POST\PUT:
```json
{ 
    "cpfcnpj" : "04810688985", 
    "active" : true
}
```

The api service will be available on port 3000

```sh
$ curl localhost:3000/api/documents -H 'Content-Type: application/json'
```

Available parameters are:

* `cpfcnpj` Document type (eg: cpf = 00000000000, cnpj: 00000000000000)
* `type` Document type (cpf or cnpj)
* `active`: Documents marked in black list
* `fromDate`: Minimum date/time of document record creation
* `toDate`: Maximum date/time of document record creation
* `limit`: Maximum documents to be returned, default: `100` max value: `1000`


The documents are returned as a JSON format.

### Examples

Getting document by cpf/cnpj number:

```sh
$ curl 'localhost:3000/api/documents?cpfcnpj=04710696985' -H 'Content-Type: application/json'
```

Getting 10 documents within a date range:

```sh
$ curl 'localhost:3000/api/documents?fromDate=2019-06-15&toDate=2019-06-16&limit=10' -H 'Content-Type: application/json'
```

### Unit tests

In order to execute them, run `yarn test` or `yarn test-watch` (to use watch mode) in the proper folder.


## Dev:
Como o projeto ainda encontra-se em desenvolvimento, para executar o projeto diretamente do diretório raiz, sem docker:

```sh
yarn start-dev
```

## Todo:
Devido ao tempo que consegui dedicar ao desenvolviment não foi possível realizar todas as tarefas.
Segue uma lista de #To-Do.

#### Server:
- Na inserção de um novo documento, validar o schema do json: (CPF\CPNJ é válido).
- Se a quantidade de documentos em uma listagem for realmente grande, transformar o retorno da rota `/api/documents` em Stream de dados.


#### Client:
- O retorno do consumo das APIs do backend, em caso de erros alterar para apresentar um feedback ao usuário através de mensagens em tela.
- Na listagem de documentos, criar recurso para que seja possível aplicar os filtros por: CPF/CNPJ, datas (FromDate e ToDate) e ativos/inativos.
- Criar paginação da listagem.
- Possibilitar ativar/desativar diretamente da listagem
- Possibilitar reordenação da lista.


#### Tests:
- Após a mudança da API GET listagem de documentos, de Stream de dados para retornar uma array simples, parte dos testes estão quebrando.
