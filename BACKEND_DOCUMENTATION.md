# Documentação do Backend - Delícias da Lú

## Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Especificação OpenAPI/Swagger](#especificação-openapiswagger)
4. [Endpoints REST](#endpoints-rest)
5. [Modelos de Dados](#modelos-de-dados)
6. [Autenticação](#autenticação)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Estrutura de Pastas](#estrutura-de-pastas)
9. [Stack Recomendado](#stack-recomendado)
10. [Implementação de Exemplo](#implementação-de-exemplo)
11. [Variáveis de Ambiente](#variáveis-de-ambiente)
12. [Deploy](#deploy)

---

## Visão Geral

O backend será responsável por toda a persistência de dados da aplicação. A arquitetura segue o padrão **REST** com endpoints que retornam **JSON** padrão.

### Características Principais
- **REST API** com métodos HTTP padrão (GET, POST, PUT, DELETE, PATCH)
- **JSON** para entrada e saída de dados
- **Autenticação JWT** para painel administrativo
- **Documentação Swagger/OpenAPI** autogerada
- **CORS** configurado para aceitar requests do frontend
- **Validação** de dados em todas as operações
- **Tratamento robusto de erros**

---

## Arquitetura

```
Frontend (React + Vite)
        ↓
   REST API (Backend)
        ↓
    Database (PostgreSQL/MongoDB)
```

### Fluxo de Dados

1. **Frontend** envia requisições HTTP para a API
2. **Backend** valida, processa e persiste os dados
3. **Database** armazena e recupera dados conforme necessário
4. **Frontend** recebe respostas JSON e atualiza a UI

---

## Especificação OpenAPI/Swagger

### Arquivo swagger.yaml / openapi.json

```yaml
openapi: 3.0.0
info:
  title: Delícias da Lú API
  version: 1.0.0
  description: API REST para gerenciamento de cardápio, pedidos e configurações da padaria/confeitaria
  contact:
    name: Suporte
    url: https://delicias-da-lu.com.br

servers:
  - url: https://api.delicias-da-lu.com.br/v1
    description: Produção
  - url: http://localhost:3000/v1
    description: Desenvolvimento

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    MenuItem:
      type: object
      required: [id, name, category, price]
      properties:
        id:
          type: string
          example: "frutas-abacaxi-creme"
        name:
          type: string
          example: "Abacaxi com creme"
        category:
          type: string
          example: "🍓 Sabores de Frutas"
        price:
          type: number
          format: float
          example: 65.00
        unit:
          type: string
          example: "kg"
        image:
          type: string
          example: "/images/bolos/frutas-abacaxi-creme.jpg"
        description:
          type: string
          example: "Bolo macio com camadas de abacaxi fresco..."
        active:
          type: boolean
          default: true
        order:
          type: integer
          example: 1

    CakeBuilderComponent:
      type: object
      required: [id, name, type]
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
          enum: [massa, recheio, cobertura, decoracao]
        price:
          type: number
          format: float
        image:
          type: string
        active:
          type: boolean
          default: true
        order:
          type: integer

    Contact:
      type: object
      properties:
        whatsapp:
          type: object
          properties:
            number:
              type: string
              example: "5585987654321"
            link:
              type: string
              example: "https://wa.me/5585987654321"
        email:
          type: string
          example: "contato@delicias-da-lu.com.br"
        instagram:
          type: string
          example: "delicias_da_lu"
        address:
          type: string
          example: "Rua das Flores, 123 - Centro"
        phone:
          type: string
          example: "(85) 3254-1234"

    Order:
      type: object
      required: [items, customerInfo]
      properties:
        id:
          type: string
          example: "ORD-20240604-001"
        items:
          type: array
          items:
            type: object
            properties:
              type:
                type: string
                enum: [menu, cakeBuilder]
              menuItemId:
                type: string
              cakeCustomization:
                type: object
              quantity:
                type: integer
              unitPrice:
                type: number
                format: float
              subtotal:
                type: number
                format: float
        customerInfo:
          type: object
          required: [name, phone]
          properties:
            name:
              type: string
            phone:
              type: string
            email:
              type: string
            deliveryDate:
              type: string
              format: date
            notes:
              type: string
        status:
          type: string
          enum: [pending, confirmed, preparing, ready, delivered, cancelled]
          default: "pending"
        totalPrice:
          type: number
          format: float
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    AdminUser:
      type: object
      properties:
        id:
          type: string
        username:
          type: string
        email:
          type: string
        role:
          type: string
          enum: [admin, manager]
        lastLogin:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time

    SiteConfig:
      type: object
      properties:
        menu:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/components/schemas/MenuItem'
            sectionLabels:
              type: object
            customSections:
              type: array
        cakeBuilder:
          type: object
          properties:
            massas:
              type: array
              items:
                $ref: '#/components/schemas/CakeBuilderComponent'
            recheios:
              type: array
              items:
                $ref: '#/components/schemas/CakeBuilderComponent'
            coberturas:
              type: array
              items:
                $ref: '#/components/schemas/CakeBuilderComponent'
            decoracoes:
              type: array
              items:
                $ref: '#/components/schemas/CakeBuilderComponent'
        contacts:
          $ref: '#/components/schemas/Contact'

    ErrorResponse:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        statusCode:
          type: integer
        timestamp:
          type: string
          format: date-time

paths:
  /health:
    get:
      summary: Verifica saúde da API
      tags: [Health]
      responses:
        200:
          description: API operacional
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"

  /auth/login:
    post:
      summary: Autentica usuário admin
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        200:
          description: Autenticação bem-sucedida
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/AdminUser'
        401:
          description: Credenciais inválidas
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /auth/refresh:
    post:
      summary: Renova token JWT
      tags: [Auth]
      security:
        - BearerAuth: []
      responses:
        200:
          description: Token renovado
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
        401:
          description: Token inválido ou expirado

  /config/public:
    get:
      summary: Retorna configuração pública (menu, cake builder, contatos)
      tags: [Config]
      responses:
        200:
          description: Configuração recuperada com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SiteConfig'
        500:
          description: Erro ao recuperar configuração

  /config/admin:
    get:
      summary: Retorna configuração completa (admin only)
      tags: [Config]
      security:
        - BearerAuth: []
      responses:
        200:
          description: Configuração recuperada com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SiteConfig'
        401:
          description: Não autenticado

    put:
      summary: Atualiza configuração completa (admin only)
      tags: [Config]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SiteConfig'
      responses:
        200:
          description: Configuração atualizada com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SiteConfig'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado

  /menu/items:
    get:
      summary: Lista todos os itens do menu
      tags: [Menu]
      parameters:
        - name: category
          in: query
          schema:
            type: string
          description: Filtrar por categoria
        - name: active
          in: query
          schema:
            type: boolean
          description: Filtrar itens ativos
      responses:
        200:
          description: Lista de itens
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MenuItem'

    post:
      summary: Cria novo item de menu (admin only)
      tags: [Menu]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MenuItem'
      responses:
        201:
          description: Item criado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItem'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado

  /menu/items/{id}:
    get:
      summary: Retorna detalhe de um item do menu
      tags: [Menu]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Item encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItem'
        404:
          description: Item não encontrado

    put:
      summary: Atualiza item de menu (admin only)
      tags: [Menu]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MenuItem'
      responses:
        200:
          description: Item atualizado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItem'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado
        404:
          description: Item não encontrado

    delete:
      summary: Deleta item de menu (admin only)
      tags: [Menu]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        204:
          description: Item deletado com sucesso
        401:
          description: Não autenticado
        404:
          description: Item não encontrado

  /menu/items/{id}/order:
    patch:
      summary: Atualiza ordem de exibição de um item (admin only)
      tags: [Menu]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [order]
              properties:
                order:
                  type: integer
      responses:
        200:
          description: Ordem atualizada com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItem'
        400:
          description: Dados inválidos

  /cake-builder:
    get:
      summary: Retorna componentes do cake builder (massas, recheios, coberturas, decorações)
      tags: [CakeBuilder]
      responses:
        200:
          description: Componentes recuperados
          content:
            application/json:
              schema:
                type: object
                properties:
                  massas:
                    type: array
                    items:
                      $ref: '#/components/schemas/CakeBuilderComponent'
                  recheios:
                    type: array
                    items:
                      $ref: '#/components/schemas/CakeBuilderComponent'
                  coberturas:
                    type: array
                    items:
                      $ref: '#/components/schemas/CakeBuilderComponent'
                  decoracoes:
                    type: array
                    items:
                      $ref: '#/components/schemas/CakeBuilderComponent'

  /cake-builder/{type}:
    get:
      summary: Lista componentes de um tipo específico
      tags: [CakeBuilder]
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [massas, recheios, coberturas, decoracoes]
      responses:
        200:
          description: Componentes do tipo especificado
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CakeBuilderComponent'

    post:
      summary: Cria novo componente de cake builder (admin only)
      tags: [CakeBuilder]
      security:
        - BearerAuth: []
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [massas, recheios, coberturas, decoracoes]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CakeBuilderComponent'
      responses:
        201:
          description: Componente criado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CakeBuilderComponent'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado

  /cake-builder/{type}/{id}:
    get:
      summary: Retorna detalhe de um componente
      tags: [CakeBuilder]
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [massas, recheios, coberturas, decoracoes]
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Componente encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CakeBuilderComponent'
        404:
          description: Componente não encontrado

    put:
      summary: Atualiza componente de cake builder (admin only)
      tags: [CakeBuilder]
      security:
        - BearerAuth: []
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [massas, recheios, coberturas, decoracoes]
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CakeBuilderComponent'
      responses:
        200:
          description: Componente atualizado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CakeBuilderComponent'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado

    delete:
      summary: Deleta componente de cake builder (admin only)
      tags: [CakeBuilder]
      security:
        - BearerAuth: []
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [massas, recheios, coberturas, decoracoes]
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        204:
          description: Componente deletado com sucesso
        401:
          description: Não autenticado

  /contacts:
    get:
      summary: Retorna informações de contato
      tags: [Contacts]
      responses:
        200:
          description: Contatos recuperados
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contact'

    put:
      summary: Atualiza informações de contato (admin only)
      tags: [Contacts]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contact'
      responses:
        200:
          description: Contatos atualizados com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Contact'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado

  /orders:
    get:
      summary: Lista todos os pedidos (admin only)
      tags: [Orders]
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, confirmed, preparing, ready, delivered, cancelled]
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        200:
          description: Lista de pedidos
          content:
            application/json:
              schema:
                type: object
                properties:
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Order'
        401:
          description: Não autenticado

    post:
      summary: Cria novo pedido
      tags: [Orders]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [items, customerInfo]
              properties:
                items:
                  type: array
                  minItems: 1
                  items:
                    type: object
                customerInfo:
                  type: object
                  required: [name, phone]
                  properties:
                    name:
                      type: string
                    phone:
                      type: string
                    email:
                      type: string
                    deliveryDate:
                      type: string
                      format: date
                    notes:
                      type: string
      responses:
        201:
          description: Pedido criado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        400:
          description: Dados inválidos

  /orders/{id}:
    get:
      summary: Retorna detalhe de um pedido
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Pedido encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        404:
          description: Pedido não encontrado

    put:
      summary: Atualiza status de um pedido (admin only)
      tags: [Orders]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status:
                  type: string
                  enum: [pending, confirmed, preparing, ready, delivered, cancelled]
      responses:
        200:
          description: Pedido atualizado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        400:
          description: Dados inválidos
        401:
          description: Não autenticado
        404:
          description: Pedido não encontrado
```

---

## Endpoints REST

### Grupos de Endpoints

#### 1. **Health Check**
- `GET /health` - Verifica se a API está operacional

#### 2. **Autenticação (Auth)**
- `POST /auth/login` - Autentica usuário admin com username/password
- `POST /auth/refresh` - Renova token JWT expirado
- `POST /auth/logout` - Invalida token (opcional)

#### 3. **Configuração (Config)**
- `GET /config/public` - Retorna config pública (menu, cake builder, contatos)
- `GET /config/admin` - Retorna config completa (auth required)
- `PUT /config/admin` - Atualiza config completa (auth required)

#### 4. **Menu (Menu)**
- `GET /menu/items` - Lista todos os itens (com filtros opcionais)
- `POST /menu/items` - Cria novo item (admin only)
- `GET /menu/items/{id}` - Retorna um item específico
- `PUT /menu/items/{id}` - Atualiza item (admin only)
- `DELETE /menu/items/{id}` - Deleta item (admin only)
- `PATCH /menu/items/{id}/order` - Atualiza ordem de exibição (admin only)

#### 5. **Cake Builder**
- `GET /cake-builder` - Retorna todos os componentes (massas, recheios, coberturas, decorações)
- `GET /cake-builder/{type}` - Lista componentes de um tipo específico
- `POST /cake-builder/{type}` - Cria novo componente (admin only)
- `GET /cake-builder/{type}/{id}` - Retorna detalhe de um componente
- `PUT /cake-builder/{type}/{id}` - Atualiza componente (admin only)
- `DELETE /cake-builder/{type}/{id}` - Deleta componente (admin only)

#### 6. **Contatos**
- `GET /contacts` - Retorna informações de contato
- `PUT /contacts` - Atualiza contatos (admin only)

#### 7. **Pedidos (Orders)**
- `GET /orders` - Lista pedidos com paginação (admin only)
- `POST /orders` - Cria novo pedido (cliente)
- `GET /orders/{id}` - Retorna detalhe do pedido
- `PUT /orders/{id}` - Atualiza status do pedido (admin only)

---

## Modelos de Dados

### MenuItem
```json
{
  "id": "frutas-abacaxi-creme",
  "name": "Abacaxi com creme",
  "category": "🍓 Sabores de Frutas",
  "price": 65.00,
  "unit": "kg",
  "image": "/images/bolos/frutas-abacaxi-creme.jpg",
  "description": "Bolo macio com camadas de abacaxi fresco...",
  "active": true,
  "order": 1,
  "createdAt": "2024-06-04T10:30:00Z",
  "updatedAt": "2024-06-04T10:30:00Z"
}
```

### CakeBuilderComponent
```json
{
  "id": "massa-chocolate",
  "name": "Massa de Chocolate",
  "type": "massa",
  "price": 45.00,
  "image": "/images/cake-builder/massa-chocolate.jpg",
  "active": true,
  "order": 1,
  "createdAt": "2024-06-04T10:30:00Z",
  "updatedAt": "2024-06-04T10:30:00Z"
}
```

### Contact
```json
{
  "whatsapp": {
    "number": "5585987654321",
    "link": "https://wa.me/5585987654321"
  },
  "email": "contato@delicias-da-lu.com.br",
  "instagram": "delicias_da_lu",
  "address": "Rua das Flores, 123 - Centro",
  "phone": "(85) 3254-1234"
}
```

### Order
```json
{
  "id": "ORD-20240604-001",
  "items": [
    {
      "type": "menu",
      "menuItemId": "frutas-abacaxi-creme",
      "quantity": 1,
      "unitPrice": 65.00,
      "subtotal": 65.00
    },
    {
      "type": "cakeBuilder",
      "cakeCustomization": {
        "massa": "massa-chocolate",
        "recheio1": "recheio-brigadeiro",
        "recheio2": "recheio-morango",
        "cobertura": "cobertura-ganache",
        "decoracoes": ["decoracao-flores"]
      },
      "quantity": 1,
      "unitPrice": 150.00,
      "subtotal": 150.00
    }
  ],
  "customerInfo": {
    "name": "João Silva",
    "phone": "5585987654321",
    "email": "joao@example.com",
    "deliveryDate": "2024-06-10",
    "notes": "Sem açúcar refinado"
  },
  "status": "pending",
  "totalPrice": 215.00,
  "createdAt": "2024-06-04T15:45:00Z",
  "updatedAt": "2024-06-04T15:45:00Z"
}
```

### SiteConfig
```json
{
  "menu": {
    "items": [{ "...": "MenuItem objects" }],
    "sectionLabels": {
      "bolos": "🎂 Bolos",
      "doces": "🍬 Doces",
      "massas": "🥐 Massas"
    },
    "customSections": []
  },
  "cakeBuilder": {
    "massas": [{ "...": "CakeBuilderComponent objects" }],
    "recheios": [{ "...": "CakeBuilderComponent objects" }],
    "coberturas": [{ "...": "CakeBuilderComponent objects" }],
    "decoracoes": [{ "...": "CakeBuilderComponent objects" }]
  },
  "contacts": {
    "...": "Contact object"
  }
}
```

---

## Autenticação

### Fluxo JWT

1. **Login**: Cliente envia `username` e `password` para `POST /auth/login`
2. **Token Gerado**: Servidor retorna JWT válido por 24 horas
3. **Request Autenticado**: Cliente envia token no header `Authorization: Bearer <token>`
4. **Refresh**: Se token expirar, cliente pode renovar via `POST /auth/refresh`

### Header de Autenticação
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Payload JWT Recomendado
```json
{
  "sub": "user_id",
  "username": "admin",
  "email": "admin@delicias-da-lu.com.br",
  "role": "admin",
  "iat": 1717503600,
  "exp": 1717590000
}
```

### Middleware de Autenticação

Aplicar em todos os endpoints que requerem auth (operações CRUD admin):
- `POST /menu/items`
- `PUT /menu/items/{id}`
- `DELETE /menu/items/{id}`
- `PATCH /menu/items/{id}/order`
- `POST /cake-builder/{type}`
- `PUT /cake-builder/{type}/{id}`
- `DELETE /cake-builder/{type}/{id}`
- `PUT /contacts`
- `GET /orders`
- `PUT /orders/{id}`

---

## Tratamento de Erros

### Formato de Erro Padrão
```json
{
  "error": "BAD_REQUEST",
  "message": "Descrição legível do erro",
  "statusCode": 400,
  "timestamp": "2024-06-04T15:45:00Z",
  "details": {
    "field": "name",
    "issue": "Campo obrigatório"
  }
}
```

### Códigos HTTP Esperados

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida, sem conteúdo na resposta |
| 400 | Bad Request - Dados inválidos ou malformados |
| 401 | Unauthorized - Autenticação necessária ou inválida |
| 403 | Forbidden - Autenticado mas sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: ID duplicado) |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |
| 502 | Bad Gateway - Servidor indisponível |

### Exemplos de Erros

#### Erro 400 - Validação
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados inválidos",
  "statusCode": 400,
  "details": [
    {
      "field": "price",
      "message": "Preço deve ser um número positivo"
    }
  ]
}
```

#### Erro 401 - Não Autenticado
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token JWT inválido ou expirado",
  "statusCode": 401
}
```

#### Erro 404 - Não Encontrado
```json
{
  "error": "NOT_FOUND",
  "message": "Item de menu com ID 'frutas-xyz' não encontrado",
  "statusCode": 404
}
```

---

## Estrutura de Pastas

### Backend Node.js/Express Recomendado

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # Conexão DB (MongoDB/PostgreSQL)
│   │   ├── swagger.js         # Configuração Swagger/OpenAPI
│   │   └── env.js             # Variáveis de ambiente
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── cakeBuilderController.js
│   │   ├── contactsController.js
│   │   ├── ordersController.js
│   │   └── configController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── cakeBuilder.js
│   │   ├── contacts.js
│   │   ├── orders.js
│   │   ├── config.js
│   │   └── index.js           # Agregador de rotas
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── CakeBuilderComponent.js
│   │   ├── Contact.js
│   │   ├── Order.js
│   │   ├── AdminUser.js
│   │   └── SiteConfig.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   ├── cors.js
│   │   └── logging.js
│   ├── services/
│   │   ├── menuService.js
│   │   ├── cakeBuilderService.js
│   │   ├── ordersService.js
│   │   ├── configService.js
│   │   └── authService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── jwt.js
│   │   └── logger.js
│   └── app.js                 # Express app setup
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local                 # Não commitar
├── package.json
├── docker-compose.yml
└── README.md
```

---

## Stack Recomendado

### Backend
- **Runtime**: Node.js 18+ ou Node.js 20 (LTS)
- **Framework**: Express.js (simples) ou Fastify (performance)
- **Database**: PostgreSQL (relacional) ou MongoDB (flexível)
- **Documentação**: Swagger/OpenAPI com `swagger-ui-express`
- **Validação**: Joi ou Zod
- **Autenticação**: jsonwebtoken (JWT)
- **Logging**: winston ou pino
- **ORM**: Sequelize (PostgreSQL) ou Mongoose (MongoDB)

### DevOps
- **Containerização**: Docker
- **Orquestração**: Docker Compose (dev) ou Kubernetes (prod)
- **Variáveis de Ambiente**: dotenv
- **Testes**: Jest ou Mocha + Chai

---

## Implementação de Exemplo

### 1. Setup Inicial

```bash
# Criar diretório
mkdir backend
cd backend

# Inicializar projeto
npm init -y

# Instalar dependências principais
npm install express cors dotenv jsonwebtoken joi swagger-ui-express swagger-jsdoc

# Instalar devDependencies
npm install --save-dev nodemon jest eslint
```

### 2. Arquivo: `package.json`

```json
{
  "name": "delicias-da-lu-backend",
  "version": "1.0.0",
  "description": "Backend REST API para Delícias da Lú",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "test": "jest",
    "lint": "eslint src"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.1.2",
    "joi": "^17.11.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8",
    "winston": "^3.11.0",
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.54.0"
  }
}
```

### 3. Arquivo: `.env.example`

```env
# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/delicias-da-lu
# ou PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/delicias_da_lu

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Admin Default
ADMIN_USERNAME=admin
ADMIN_PASSWORD=lu123456

# Swagger
SWAGGER_ENABLED=true

# CORS
CORS_ORIGIN=http://localhost:5173,https://delicias-da-lu.com.br

# Logging
LOG_LEVEL=debug
```

### 4. Arquivo: `src/app.js`

```javascript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import authRoutes from './routes/auth.js'
import menuRoutes from './routes/menu.js'
import cakeBuilderRoutes from './routes/cakeBuilder.js'
import contactsRoutes from './routes/contacts.js'
import ordersRoutes from './routes/orders.js'
import configRoutes from './routes/config.js'
import errorHandler from './middleware/errorHandler.js'
import logger from './utils/logger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delícias da Lú API',
      version: '1.0.0',
      description: 'API REST para gerenciamento da padaria/confeitaria'
    },
    servers: [
      {
        url: `http://localhost:${PORT}/${process.env.API_VERSION}`,
        description: 'Desenvolvimento'
      },
      {
        url: `https://api.delicias-da-lu.com.br/${process.env.API_VERSION}`,
        description: 'Produção'
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}))

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// API Routes
const apiVersion = process.env.API_VERSION || 'v1'
const basePath = `/api/${apiVersion}`

app.use(`${basePath}/auth`, authRoutes)
app.use(`${basePath}/menu`, menuRoutes)
app.use(`${basePath}/cake-builder`, cakeBuilderRoutes)
app.use(`${basePath}/contacts`, contactsRoutes)
app.use(`${basePath}/orders`, ordersRoutes)
app.use(`${basePath}/config`, configRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Rota ${req.method} ${req.path} não encontrada`,
    statusCode: 404
  })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`)
  logger.info(`📚 Documentação em http://localhost:${PORT}/api-docs`)
})

export default app
```

### 5. Arquivo: `src/middleware/auth.js`

```javascript
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

export function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Token não fornecido',
        statusCode: 401
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    logger.error('Auth error:', error)
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token inválido ou expirado',
      statusCode: 401
    })
  }
}

export function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Acesso permitido apenas para administradores',
      statusCode: 403
    })
  }
  next()
}

export default {
  verifyToken,
  isAdmin
}
```

### 6. Arquivo: `src/routes/auth.js`

```javascript
import express from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica usuário admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body

    // Validação básica
    if (!username || !password) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Username e password são obrigatórios',
        statusCode: 400
      })
    }

    // Verificar credenciais (integrar com banco de dados)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'lu123456'

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Credenciais inválidas',
        statusCode: 401
      })
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        sub: 'admin',
        username,
        role: 'admin',
        email: 'admin@delicias-da-lu.com.br'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    )

    res.json({
      token,
      user: {
        id: 'admin',
        username,
        role: 'admin'
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erro ao fazer login',
      statusCode: 500
    })
  }
})

export default router
```

### 7. Arquivo: `src/utils/logger.js`

```javascript
const logger = {
  info: (msg, data) => console.log(`✓ ${msg}`, data || ''),
  error: (msg, err) => console.error(`✗ ${msg}`, err || ''),
  warn: (msg, data) => console.warn(`⚠ ${msg}`, data || ''),
  debug: (msg, data) => console.log(`🔍 ${msg}`, data || '')
}

export default logger
```

### 8. Arquivo: `docker-compose.yml`

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: delicias-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: delicias-da-lu
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    container_name: delicias-backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      MONGODB_URI: mongodb://admin:admin123@mongodb:27017/delicias-da-lu?authSource=admin
      JWT_SECRET: dev-secret-key
      ADMIN_USERNAME: admin
      ADMIN_PASSWORD: lu123456
    depends_on:
      - mongodb
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongodb_data:
```

---

## Variáveis de Ambiente

### `.env.development`
```env
PORT=3000
NODE_ENV=development
API_VERSION=v1
MONGODB_URI=mongodb://localhost:27017/delicias-da-lu
JWT_SECRET=dev-secret-key-not-secure
JWT_EXPIRATION=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=lu123456
CORS_ORIGIN=http://localhost:5173
SWAGGER_ENABLED=true
LOG_LEVEL=debug
```

### `.env.production`
```env
PORT=3000
NODE_ENV=production
API_VERSION=v1
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/delicias-da-lu
JWT_SECRET=<use strong random key from password generator>
JWT_EXPIRATION=24h
ADMIN_USERNAME=<set strong username>
ADMIN_PASSWORD=<set strong password>
CORS_ORIGIN=https://delicias-da-lu.com.br
SWAGGER_ENABLED=false
LOG_LEVEL=info
```

---

## Deploy

### Opção 1: Docker (Recomendado)

```bash
# Build da imagem
docker build -t delicias-backend:latest .

# Rodar com docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar
docker-compose down
```

### Opção 2: Heroku

```bash
heroku login
heroku create delicias-da-lu-backend
heroku buildpacks:add heroku/nodejs
git push heroku main
heroku config:set JWT_SECRET=<random-key>
heroku logs -t
```

### Opção 3: VPS/Cloud (DigitalOcean, AWS, etc)

```bash
# SSH para o servidor
ssh root@your-server-ip

# Clonar repo
git clone https://github.com/seu-repo/backend.git
cd backend

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependências
npm install --production

# Usar PM2 para manter processo ativo
sudo npm install -g pm2
pm2 start src/app.js --name "delicias-backend"
pm2 startup
pm2 save

# Configurar Nginx como reverse proxy
sudo apt-get install -y nginx

# Configurar SSL com Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.delicias-da-lu.com.br
```

---

## Próximas Etapas

1. **Criar repositório Git** para o backend
2. **Implementar modelos de dados** com Mongoose/Sequelize
3. **Conectar ao banco de dados** (MongoDB ou PostgreSQL)
4. **Implementar todos os controllers** seguindo o padrão
5. **Adicionar validações** com Joi/Zod
6. **Criar testes** (unitários e integração)
7. **Configurar CI/CD** (GitHub Actions, GitLab CI, etc)
8. **Deploy em produção**
9. **Configurar monitoramento** (Sentry, New Relic, etc)
10. **Atualizar frontend** para consumir API Backend

---

## Referências Úteis

- **Express.js Docs**: https://expressjs.com/
- **JWT Guide**: https://jwt.io/
- **Swagger/OpenAPI**: https://swagger.io/
- **MongoDB**: https://www.mongodb.com/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Docker**: https://docs.docker.com/
- **REST Best Practices**: https://restfulapi.net/

