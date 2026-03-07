# Order API

API REST para gerenciamento de pedidos desenvolvida com **Node.js**, **Express**, **Prisma ORM**, **MySQL** e **autenticação JWT**.

O projeto foi desenvolvido como parte de um **desafio técnico**, implementando operações de CRUD para pedidos, autenticação de usuários e boas práticas de backend como middleware de erros e organização em camadas.

---

# Tecnologias utilizadas

* Node.js
* Express
* Prisma ORM
* MySQL
* JWT
* bcrypt
* Postman para testes
* Swagger para documentação 

---

# Funcionalidades

* Registro de usuário
* Login com geração de token JWT
* Autenticação via middleware
* CRUD completo de pedidos
* Transformação de dados antes de persistir no banco
* Middleware global de tratamento de erros
* Documentação via Postman

---

# Estrutura do projeto

```
desafio/
├ prisma/
│ ├ schema.prisma
│ └ migrations/
│
├ 
├ controllers/
│ ├ authController.js
│ └ orderController.js
|
├ middlewares/
│ ├ authMiddleware.js
│ ├ errorMiddleware.js
│ └ notFoundMiddleware.js
│
├ routes/
│ ├ authRoutes.js
│ └ orderRoutes.js
│ 
├ lib/
│ └ prisma.js
│
└ app.js
│
├ docs/
│ └ API-order.postman_collection.json
│
├ server.js
├ package.json
└ .env
```

---

# Instalação

Clone o repositório:

```
git clone https://github.com/luizHramoss/order-api.git
cd order-api
```

Instale as dependências:

```
npm install
```

---

# Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```
PORT=3000

DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/order_db"

JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1d
```

Exemplo:

```
DATABASE_URL="mysql://henrique:senha@localhost:3306/order_db"
```

---

# Banco de dados

Execute as migrations do Prisma:

```
npx prisma generate
npx prisma migrate dev --name init
```

---

# Executar o projeto

Modo desenvolvimento:

```
npm run dev
```

Ou diretamente:

```
node server.js
```

Servidor iniciará em:

```
http://localhost:3000
```

---

# Autenticação

A API utiliza **JWT** para proteger as rotas de pedidos.

Fluxo:

1. Registrar usuário
2. Fazer login
3. Utilizar o token nas rotas protegidas

Header necessário:

```
Authorization: Bearer TOKEN
```

---

# Endpoints

## Autenticação

### Registrar usuário

POST `/auth/register`

```
{
 "name": "Luiz Henrique",
 "email": "luiz@email.com",
 "password": "123456"
}
```

---

### Login

POST `/auth/login`

```
{
 "email": "luiz@email.com",
 "password": "123456"
}
```

Resposta:

```
{
 "message": "Login realizado com sucesso.",
 "token": "JWT_TOKEN"
}
```

---

# Pedidos

Todas as rotas abaixo exigem autenticação.

---

### Criar pedido

POST `/order`

```
{
 "numeroPedido": "v10089015vdb-01",
 "valorTotal": 10000,
 "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
 "items": [
  {
   "idItem": "2434",
   "quantidadeItem": 1,
   "valorItem": 1000
  }
 ]
}
```

---

### Listar pedidos

GET `/order/list`

---

### Buscar pedido por ID

GET `/order/{id}`

Exemplo:

```
/order/v10089015vdb
```

---

### Atualizar pedido

PUT `/order/{id}`

---

### Deletar pedido

DELETE `/order/{id}`

---

# Transformação de dados

O payload recebido pela API passa por um **mapping antes de ser salvo no banco**.

Entrada:

```
numeroPedido
valorTotal
dataCriacao
items
```

Persistido no banco:

```
orderId
value
creationDate
items {
 productId
 quantity
 price
}
```

---

# Tratamento de erros

A API possui middleware global para tratamento de erros.

Erros internos não expõem detalhes sensíveis.

Resposta padrão:

```
{
 "message": "Ocorreu um erro interno no servidor."
}
```

---

# Testando com Postman

A documentação da API também está disponível através de uma collection do Postman.

Os arquivos estão disponíveis em:

```
docs/API-order.postman_collection.json
docs/API-order.postman_environment.json
```

## Importando no Postman

1. Abra o Postman
2. Clique em **Import**
3. Selecione os arquivos:

```
docs/API-order.postman_collection.json
docs/API-order.postman_environment.json
```

4. Após importar, selecione o **Environment** no canto superior direito do Postman.

## Captura automática do token

A collection está configurada para capturar automaticamente o token retornado no login.

A requisição `/auth/login` possui um script na aba **Tests**:

```javascript
const jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

Após o login, o token é salvo automaticamente na variável:

```
{{token}}
```

## Fluxo de teste

1. Execute `/auth/register` (opcional)
2. Execute `/auth/login`
3. O token retornado será salvo automaticamente na variável `{{token}}`
4. As rotas protegidas utilizam automaticamente o header:

```
Authorization: Bearer {{token}}
```

---

# Melhorias futuras

* Documentação Swagger
* Validação de dados com Zod ou Joi
* Testes automatizados
* Dockerização da aplicação
* CI/CD

---

# Autor

Luiz Henrique
