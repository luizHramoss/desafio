# Order API

API REST para gerenciamento de pedidos desenvolvida com **Node.js**, **Express**, **Prisma ORM**, **MySQL** e **autenticação JWT**.

O projeto foi desenvolvido como parte de um **desafio técnico**, implementando operações de CRUD para pedidos, autenticação de usuários e boas práticas de backend como middleware de erros, validação de dados e organização em camadas.

---

# Tecnologias utilizadas

* Node.js
* Express
* Prisma ORM
* MySQL
* JWT (JSON Web Token)
* bcrypt
* Swagger (documentação da API)
* Postman (testes de API)

---

# Funcionalidades

* Registro de usuário
* Login com geração de token JWT
* Autenticação via middleware
* CRUD completo de pedidos
* Transformação de dados antes de persistir no banco
* Validação de dados nas requisições
* Middleware global de tratamento de erros
* Documentação da API com Swagger
* Collection do Postman para testes

---

# Estrutura do projeto

```
order-api/
│
├ config/
│
├ controllers/
│ ├ authController.js
│ └ orderController.js
│
├ docs/
│ ├ API-order.postman_collection.json
│ └ API-order.postman_environment.json
│
├ lib/
│ └ prisma.js
│
├ middleware/
│ ├ authMiddleware.js
│ ├ errorMiddleware.js
│ └ notFoundMiddleware.js
│
├ models/
│
├ prisma/
│ ├ schema.prisma
│ └ migrations/
│
├ routes/
│ ├ authRoutes.js
│ └ orderRoutes.js
│
├ utils/
│ ├ appError.js
│ └ asyncHandler.js
│
├ validator/
│ └ orderValidator.js
│
├ .env
├ .env.example
├ .gitignore
├ app.js
├ server.js
├ swagger.js
├ package.json
└ README.md
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

# Documentação Swagger

A documentação interativa da API está disponível em:

```
http://localhost:3000/api-docs
```

Nela é possível testar os endpoints diretamente pelo navegador.

Para testar rotas protegidas:

1. Faça login em `/auth/login`
2. Copie o token retornado
3. Clique no botão **Authorize**
4. Cole o token JWT

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

O payload recebido pela API passa por um **processo de transformação antes de ser salvo no banco**.

Entrada da API:

```
numeroPedido
valorTotal
dataCriacao
items
```

Estrutura persistida no banco:

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

# Validação de dados

A API possui validações para evitar dados inconsistentes, como:

* Campos obrigatórios vazios
* Strings contendo apenas espaços
* Valores negativos
* Datas inválidas
* Itens duplicados no pedido
* Arrays vazios
* Quantidade de itens acima do limite permitido

As validações estão implementadas em:

```
validator/orderValidator.js
```

---

# Tratamento de erros

A API possui um middleware global para tratamento de erros.

Erros internos não expõem detalhes sensíveis da aplicação.

Resposta padrão:

```
{
 "message": "Ocorreu um erro interno no servidor."
}
```

---

# Testando com Postman

A documentação da API também está disponível através de uma collection do Postman.

Arquivos disponíveis em:

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

---

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

---

## Fluxo de teste

1. Execute `/auth/register` (opcional)
2. Execute `/auth/login`
3. O token retornado será salvo automaticamente na variável `{{token}}`
4. As rotas protegidas utilizam automaticamente o header:

```
Authorization: Bearer {{token}}
```

# Autor

Luiz Henrique
