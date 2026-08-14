# Task Manager API

API REST para gerenciamento de projetos e tarefas, desenvolvida com **Node.js**, **Express**, **TypeScript**, **Prisma**, **SQLite** e autenticação via **JWT**.

## Sobre o projeto

O **Task Manager API** é o backend de uma aplicação fullstack para organização de projetos e tarefas.

A API permite que usuários criem conta, façam login, gerenciem seus próprios projetos e cadastrem tarefas vinculadas a esses projetos. As rotas principais são protegidas por autenticação JWT, garantindo que cada usuário acesse apenas seus próprios dados.

Este projeto foi desenvolvido com foco em prática de backend, autenticação, banco de dados, organização de rotas, controllers, middlewares e integração com frontend.

## Funcionalidades

- Cadastro de usuário
- Login com JWT
- Rota para buscar usuário autenticado
- Criação de projetos
- Listagem de projetos do usuário
- Busca de projeto por ID
- Atualização de projetos
- Exclusão de projetos
- Criação de tarefas dentro de projetos
- Listagem de tarefas por projeto
- Busca de tarefa por ID
- Atualização de tarefas
- Exclusão de tarefas
- Marcação de tarefa como concluída
- Validação de status e prioridade
- Proteção de rotas com middleware de autenticação

## Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT
- BcryptJS
- CORS
- Dotenv
- TSX

## Frontend

Este backend é consumido pelo frontend:

```txt
task-manager-web

```

Repositório do frontend:

```txt
https://github.com/JayJ2k/task-manager-web

```

## Estrutura do projeto

```txt
src/
├── config/
│   └── prisma.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── project.controller.ts
│   └── task.controller.ts
├── middlewares/
│   └── auth.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   └── task.routes.ts
├── services/
├── utils/
└── server.ts

```

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/JayJ2k/task-manager-api.git

```

### 2. Entrar na pasta do projeto

```bash
cd task-manager-api

```

### 3. Instalar as dependências

```bash
npm install

```

No Windows, também pode usar:

```bash
npm.cmd install

```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3333
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"

```

### 5. Rodar as migrations do Prisma

```bash
npx prisma migrate dev

```

No Windows:

```bash
npx.cmd prisma migrate dev

```

### 6. Rodar o projeto em desenvolvimento

```bash
npm run dev

```

No Windows:

```bash
npm.cmd run dev

```

A API ficará disponível em:

```txt
http://localhost:3333

```

## Scripts disponíveis

```json
"dev": "tsx watch src/server.ts",
"build": "tsc",
"start": "node dist/server.js",
"prisma:migrate": "prisma migrate dev",
"prisma:studio": "prisma studio"

```

## Rotas da API

### Autenticação


| Método | Rota             | Descrição                            | Autenticação |
| ------ | ---------------- | ------------------------------------ | ------------ |
| POST   | `/auth/register` | Cadastra um novo usuário             | Não          |
| POST   | `/auth/login`    | Realiza login e retorna token JWT    | Não          |
| GET    | `/auth/me`       | Retorna dados do usuário autenticado | Sim          |


### Projetos


| Método | Rota            | Descrição                 | Autenticação |
| ------ | --------------- | ------------------------- | ------------ |
| POST   | `/projects`     | Cria um projeto           | Sim          |
| GET    | `/projects`     | Lista projetos do usuário | Sim          |
| GET    | `/projects/:id` | Busca um projeto por ID   | Sim          |
| PUT    | `/projects/:id` | Atualiza um projeto       | Sim          |
| DELETE | `/projects/:id` | Deleta um projeto         | Sim          |


### Tarefas


| Método | Rota                         | Descrição                            | Autenticação |
| ------ | ---------------------------- | ------------------------------------ | ------------ |
| POST   | `/projects/:projectId/tasks` | Cria uma tarefa dentro de um projeto | Sim          |
| GET    | `/projects/:projectId/tasks` | Lista tarefas de um projeto          | Sim          |
| GET    | `/tasks/:id`                 | Busca uma tarefa por ID              | Sim          |
| PUT    | `/tasks/:id`                 | Atualiza uma tarefa                  | Sim          |
| DELETE | `/tasks/:id`                 | Deleta uma tarefa                    | Sim          |
| PATCH  | `/tasks/:id/done`            | Marca uma tarefa como concluída      | Sim          |


## Exemplos de requisições

### Cadastro

```http
POST /auth/register

```

```json
{
  "name": "Breno Henrique",
  "email": "breno@email.com",
  "password": "123456"
}

```

### Login

```http
POST /auth/login

```

```json
{
  "email": "breno@email.com",
  "password": "123456"
}

```

Resposta esperada:

```json
{
  "message": "Login realizado com sucesso.",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Breno Henrique",
    "email": "breno@email.com"
  }
}

```

### Criar projeto

```http
POST /projects
Authorization: Bearer jwt-token

```

```json
{
  "title": "Projeto de Estudos",
  "description": "Projeto para organizar tarefas de estudo e desenvolvimento."
}

```

### Criar tarefa

```http
POST /projects/:projectId/tasks
Authorization: Bearer jwt-token

```

```json
{
  "title": "Estudar TypeScript",
  "description": "Revisar controllers, routes e middlewares.",
  "priority": "HIGH"
}

```

## Status das tarefas

As tarefas podem possuir os seguintes status:

```txt
PENDING
IN_PROGRESS
DONE

```

## Prioridades das tarefas

As tarefas podem possuir as seguintes prioridades:

```txt
LOW
MEDIUM
HIGH

```

## Banco de dados

O projeto utiliza **SQLite** em ambiente local, com gerenciamento via **Prisma ORM**.

Para visualizar os dados pelo Prisma Studio:

```bash
npm run prisma:studio

```

No Windows:

```bash
npm.cmd run prisma:studio

```

O Prisma Studio normalmente abrirá em:

```txt
http://localhost:5555

```

## Build

Para gerar a versão compilada do projeto:

```bash
npm run build

```

No Windows:

```bash
npm.cmd run build

```

## Melhorias futuras

- Adicionar testes automatizados
- Criar documentação com Swagger
- Implementar Docker
- Migrar banco para PostgreSQL
- Adicionar paginação nas listagens
- Adicionar filtros por status e prioridade
- Melhorar tratamento global de erros
- Criar refresh token
- Fazer deploy da API
- Adicionar CI/CD com GitHub Actions

## Autor

Desenvolvido por **Breno Henrique** como projeto de portfólio em desenvolvimento backend/fullstack.

