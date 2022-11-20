# NG Cash - Backend Challenge

> API desenvolvida para o desafio do processo seletivo para vaga de backend na NG.CASH.
> Desenvolvimento de um API para a tranferência entre contas de um banco digital utilizando typescript, jest, prisma e docker rodando um banco de dados Postgres

## Pré-requisitos para rodar a aplicação

- [Docker](https://www.docker.com/) instalado
- [Node.js]() instalado

## Rodando o projeto

```bash
# Faça o clone do projeto
$ git clone git@github.com:LucasMedeiros7/ngcash-backend-challenge.git

# Entre na pasta do projeto
$ cd ngcash-backend-challenge

# Instale as dependências
$ npm install

# Suba o banco de dados da aplicação utilizando o docker-compose
$ docker-compose up -d

# Aguarde o docker inicializar.
# Altere o nome do arquivo ".env.example" para ".env" apenas

# Rode as migrations para criar criar e popular as tabelas no banco de dados
$ npm run migrate

# Inicie o servidor
$ npm run dev
```

### Aplicação vai estar rodando em http://localhost:3333

## Rotas da aplicação

### Rota para criar um usuário

#### POST `/users`

Precisa estar logado: Não.<br/>
Template para enviar os dados:<br/>

```json
{
  "username": "johndoe",
  "password": "S3nhaforte"
}
```

### Rota para fazer o login do usuário

#### POST `/users`

Precisa estar logado: Não.<br>
Template para enviar os dados:<br>

```json
{
  "username": "johndoe",
  "password": "S3nhaforte"
}
```

### Rota para fazer uma transferência (Necessário que seja passado o token de autenticação)

#### POST `/transactions`

Precisa estar logado:Sim.<br>
Template para enviar os dados:<br>

```bash
Content-type: application/json
Authorization: Bearer <TOKEN JWT>

{
  "accountDestinationId": "dk2k213jl23kddddfffitFT",
  "value": 1000,
}
```

### Rota para consultar o saldo atual da conta (Necessário que seja passado o token de autenticação)

#### GET `/users/balance`

Precisa estar logado: Sim.<br>
Template para enviar os dados:<br>

```bash
Content-type: application/json
Authorization: Bearer <TOKEN JWT>
```

### Rota para listar todas as transferências de cash-in e cash-out do usuário (Necessário que seja passado o token de autenticação)

#### GET `/transactions`

Precisa estar logado: Sim.<br>
Template para enviar os dados:<br>

```bash
Content-type: application/json
Authorization: Bearer <TOKEN JWT>
```

### Rota para listar transaferências de cash-in ou cash-out (Necessário que seja passado o token de autenticação)

#### GET `/transactions/cash-in` ou `/transactions/cash-out`

Precisa estar logado: Sim.<br>
Template para enviar os dados:<br>

```bash
Content-type: application/json
Authorization: Bearer <TOKEN JWT>
```

### Rota para listar transaferências por data (Necessário que seja passado o token de autenticação)

#### GET `/transactions?date=dd/mm/yyyy`

Precisa estar logado: Sim.<br>
Template para enviar os dados:<br>

```bash
Content-type: application/json
Authorization: Bearer <TOKEN JWT>
```
