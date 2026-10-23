# Projeto Backend

API REST para gerenciamento de usuários, categorias e produtos com autenticação JWT, Sequelize, MySQL e documentação Swagger.

## Tecnologias utilizadas
- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- Swagger
- Jest

## Estrutura do projeto
```bash
project-root/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── src/database/
│   ├── migrations/
│   └── seeders/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── .sequelizerc
```

## Requisitos
- Node.js 18+
- MySQL
- NPM

## Instalação
1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Crie o banco de dados no MySQL:
```sql
CREATE DATABASE projeto_backend;
```

4. Configure o arquivo `.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=projeto_backend
DB_USER=root
DB_PASSWORD=
JWT_SECRET=sua_chave_secreta
PORT=3000
```

5. Rode as migrations:
```bash
npx sequelize-cli db:migrate
```

6. Inicie a aplicação:
```bash
npm run dev
```

A API estará disponível em:
```bash
http://localhost:3000
```

A documentação Swagger estará disponível em:
```bash
http://localhost:3000/api-docs
```

## Endpoints

### Autenticação
#### Login
- POST /v1/user/token

Payload:
```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Resposta:
```json
{
  "token": "jwt_token"
}
```

### Usuários
#### Cadastrar usuário
- POST /v1/user

Payload:
```json
{
  "firstname": "João",
  "surname": "Silva",
  "email": "joao@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

#### Buscar usuário por ID
- GET /v1/user/:id

#### Atualizar usuário
- PUT /v1/user/:id

#### Excluir usuário
- DELETE /v1/user/:id

### Categorias
#### Listar categorias
- GET /v1/category/search

Query params:
- limit
- page
- use_in_menu
- fields

#### Buscar categoria por ID
- GET /v1/category/:id

#### Cadastrar categoria
- POST /v1/category

Payload:
```json
{
  "name": "Tênis",
  "slug": "tenis",
  "use_in_menu": true
}
```

#### Atualizar categoria
- PUT /v1/category/:id

#### Excluir categoria
- DELETE /v1/category/:id

### Produtos
#### Buscar produtos
- GET /v1/product/search

#### Buscar produto por ID
- GET /v1/product/:id

#### Cadastrar produto
- POST /v1/product

Payload:
```json
{
  "enabled": true,
  "name": "Produto 01",
  "slug": "produto-01",
  "use_in_menu": true,
  "stock": 10,
  "description": "Descrição do produto 01",
  "price": 119.90,
  "price_with_discount": 99.90,
  "category_ids": [1, 2],
  "images": [
    {
      "path": "/uploads/produto-01.png",
      "enabled": true
    }
  ],
  "options": [
    {
      "title": "Tamanho",
      "shape": "square",
      "radius": 4,
      "type": "text",
      "values": ["P", "M", "G"]
    }
  ]
}
```

#### Atualizar produto
- PUT /v1/product/:id

#### Excluir produto
- DELETE /v1/product/:id

## Autenticação
Todos os endpoints de POST, PUT e DELETE exigem o token JWT no header:

```http
Authorization: Bearer <token>
```

## Observações
- O projeto usa Sequelize e migrations para gerar o banco.
- O armazenamento de senhas é feito com hash via bcrypt.
- O projeto foi organizado em camadas para facilitar manutenção e escalabilidade.

## Critérios de entrega
- CRUD completo de usuários
- CRUD completo de categorias
- CRUD completo de produtos
- autenticação JWT
- tratamento de erros
- boas práticas de organização
- documentação de setup
