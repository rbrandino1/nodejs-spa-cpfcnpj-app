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

The api service will be available on port 3000

```sh
$ curl localhost:3000/documents -H 'Content-Type: application/json'
```

Available parameters are:

* `cpfcnpj` Document type (eg: cpf = 00000000000, cnpj: 00000000000000)
* `type` Document type (cpf or cnpj)
* `active`: Documents marked in black list
* `fromDate`: Minimum date/time of document record creation
* `toDate`: Maximum date/time of document record creation
* `limit`: Maximum documents to be returned, default: `100` max value: `1000`


The events are returned as a JSON format.

### Examples

Getting events for a client:

```sh
$ curl 'localhost:3000/documents?cpfcnpj=04710696985' -H 'Content-Type: application/json'
```

Getting 10 documents within a date range:

```sh
$ curl 'localhost:3000/documents?fromDate=2019-06-15&toDate=2019-06-16&limit=10' -H 'Content-Type: application/json'
```

### Unit tests

Each project has its own set of unit tests. In order to execute them, run `yarn test` or `yarn test-watch` (to use watch mode) in the proper folder.
