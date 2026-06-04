# Roadmap de Implementação - Backend & Integração

## Fases de Implementação

### Fase 1: Setup Inicial do Backend (Semana 1)

#### 1.1 Criar Repositório e Estrutura Base
- [ ] Criar novo repositório para backend: `delicias-da-lu-backend`
- [ ] Clonar e setup inicial
  ```bash
  mkdir delicias-da-lu-backend
  cd delicias-da-lu-backend
  npm init -y
  ```
- [ ] Criar estrutura de pastas:
  ```
  src/
  ├── config/
  ├── controllers/
  ├── routes/
  ├── models/
  ├── middleware/
  ├── services/
  ├── utils/
  └── app.js
  tests/
  .env.example
  .gitignore
  package.json
  docker-compose.yml
  Dockerfile
  ```

#### 1.2 Instalar Dependências
```bash
npm install express cors dotenv jsonwebtoken joi swagger-ui-express swagger-jsdoc mongoose winston
npm install --save-dev nodemon jest eslint
```

#### 1.3 Configurar Variáveis de Ambiente
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Criar `.env.local` para desenvolvimento
- [ ] Adicionar `.env.local` ao `.gitignore`

#### 1.4 Criar Arquivo Base de App
- [ ] Criar `src/app.js` com Express setup
- [ ] Configurar CORS
- [ ] Configurar Swagger/OpenAPI
- [ ] Adicionar rota `/health`
- [ ] Testar acesso em `http://localhost:3000/health`

**Resultado Final**: Backend rodando localmente na porta 3000

---

### Fase 2: Banco de Dados e Modelos (Semana 1-2)

#### 2.1 Escolher e Configurar Banco de Dados

**Opção A: MongoDB (Recomendado para começar)**
```bash
npm install mongoose
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Opção B: PostgreSQL**
```bash
npm install pg sequelize
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:15
```

#### 2.2 Criar Modelos (Mongoose Example)

**Arquivo: `src/models/MenuItem.js`**
```javascript
import mongoose from 'mongoose'

const MenuItemSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'kg' },
  image: { type: String },
  description: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('MenuItem', MenuItemSchema)
```

- [ ] Criar modelo MenuItem
- [ ] Criar modelo CakeBuilderComponent
- [ ] Criar modelo Contact
- [ ] Criar modelo Order
- [ ] Criar modelo AdminUser
- [ ] Criar modelo SiteConfig

#### 2.3 Seed de Dados Iniciais
- [ ] Criar script: `src/scripts/seedDatabase.js`
- [ ] Importar dados do arquivo `menu.json` do frontend
- [ ] Importar dados do arquivo `cakeBuilder.json` do frontend
- [ ] Testar seed: `node src/scripts/seedDatabase.js`

**Resultado Final**: MongoDB/PostgreSQL configurado com dados iniciais

---

### Fase 3: Autenticação JWT (Semana 2)

#### 3.1 Implementar Autenticação
- [ ] Criar `src/utils/jwt.js` com funções de geração/validação de tokens
- [ ] Criar `src/middleware/auth.js` com verificação de token
- [ ] Criar `src/services/authService.js`

#### 3.2 Criar Endpoint de Login
- [ ] Criar `src/routes/auth.js` com POST `/auth/login`
- [ ] Criar `src/routes/auth.js` com POST `/auth/refresh`
- [ ] Testar login com Postman/Insomnia:
  ```bash
  POST http://localhost:3000/api/v1/auth/login
  Body: { "username": "admin", "password": "lu123456" }
  ```

#### 3.3 Testar Autenticação
- [ ] Copiar token retornado
- [ ] Fazer requisição com token no header: `Authorization: Bearer <token>`
- [ ] Verificar que requisição sem token retorna 401

**Resultado Final**: Autenticação JWT funcionando

---

### Fase 4: CRUD de Menu (Semana 2-3)

#### 4.1 Implementar Endpoints GET
- [ ] `GET /api/v1/menu/items` - Listar todos (com paginação e filtros)
- [ ] `GET /api/v1/menu/items/{id}` - Obter um item
- [ ] Testar no Postman/Insomnia
- [ ] Testar filtros: `?category=bolos&active=true`

#### 4.2 Implementar Endpoints POST/PUT/DELETE
- [ ] `POST /api/v1/menu/items` - Criar (admin only)
- [ ] `PUT /api/v1/menu/items/{id}` - Atualizar (admin only)
- [ ] `DELETE /api/v1/menu/items/{id}` - Deletar (admin only)
- [ ] `PATCH /api/v1/menu/items/{id}/order` - Atualizar ordem
- [ ] Testar cada endpoint com dados válidos e inválidos

#### 4.3 Validação
- [ ] Criar `src/utils/validators.js` com validação Joi
- [ ] Validar campos obrigatórios: name, category, price
- [ ] Validar tipos de dados
- [ ] Testar erro 400 com dados inválidos

**Resultado Final**: Menu CRUD completo funcionando

---

### Fase 5: CRUD do Cake Builder (Semana 3)

#### 5.1 Implementar Endpoints GET
- [ ] `GET /api/v1/cake-builder` - Obter todos os componentes
- [ ] `GET /api/v1/cake-builder/{type}` - Obter por tipo (massas, recheios, etc)
- [ ] `GET /api/v1/cake-builder/{type}/{id}` - Obter um componente

#### 5.2 Implementar Endpoints POST/PUT/DELETE
- [ ] `POST /api/v1/cake-builder/{type}` - Criar (admin only)
- [ ] `PUT /api/v1/cake-builder/{type}/{id}` - Atualizar (admin only)
- [ ] `DELETE /api/v1/cake-builder/{type}/{id}` - Deletar (admin only)

#### 5.3 Validação
- [ ] Validar type: massas, recheios, coberturas, decoracoes
- [ ] Validar campos obrigatórios
- [ ] Testar erros

**Resultado Final**: Cake Builder CRUD completo

---

### Fase 6: Gerenciamento de Pedidos (Semana 3-4)

#### 6.1 Implementar Endpoints Público
- [ ] `POST /api/v1/orders` - Criar novo pedido (sem autenticação)
- [ ] `GET /api/v1/orders/{id}` - Obter pedido público

#### 6.2 Implementar Endpoints Admin
- [ ] `GET /api/v1/orders` - Listar pedidos com paginação (admin only)
- [ ] `PUT /api/v1/orders/{id}` - Atualizar status (admin only)

#### 6.3 Validação
- [ ] Validar items array não está vazio
- [ ] Validar customerInfo obrigatório
- [ ] Calcular totalPrice automaticamente
- [ ] Testes com dados válidos e inválidos

**Resultado Final**: Sistema de pedidos funcionando

---

### Fase 7: Contatos e Configuração (Semana 4)

#### 7.1 Endpoints de Contatos
- [ ] `GET /api/v1/contacts` - Retorna contatos
- [ ] `PUT /api/v1/contacts` - Atualiza contatos (admin only)

#### 7.2 Endpoints de Configuração
- [ ] `GET /api/v1/config/public` - Config pública (menu + cake builder + contatos)
- [ ] `GET /api/v1/config/admin` - Config completa (admin only)
- [ ] `PUT /api/v1/config/admin` - Atualizar config (admin only)

#### 7.3 Swagger/OpenAPI
- [ ] Documentação automática em `/api-docs`
- [ ] Testar interatividade do Swagger UI
- [ ] Validar que todos endpoints aparecem no Swagger

**Resultado Final**: Backend 100% funcional com documentação

---

### Fase 8: Testes (Semana 4-5)

#### 8.1 Testes Unitários
- [ ] Criar testes para validators
- [ ] Criar testes para JWT utils
- [ ] Criar testes para services

#### 8.2 Testes de Integração
- [ ] Testar fluxo completo de login
- [ ] Testar CRUD de menu
- [ ] Testar CRUD de cake builder
- [ ] Testar criação de pedido

#### 8.3 Testar com Ferramentas
- [ ] Postman/Insomnia collection
- [ ] Testar com cURL
- [ ] Testar com Thunder Client (VS Code)

**Resultado Final**: Backend testado e validado

---

### Fase 9: Docker e Deploy (Semana 5)

#### 9.1 Dockerizar Backend
- [ ] Criar `Dockerfile`
- [ ] Criar `docker-compose.yml` com MongoDB
- [ ] Testar build: `docker build -t delicias-backend .`
- [ ] Testar compose: `docker-compose up`

#### 9.2 Deploy em Staging
- [ ] Escolher plataforma: Heroku, DigitalOcean, AWS, etc
- [ ] Configurar variáveis de ambiente em produção
- [ ] Deploy inicial
- [ ] Testar endpoints em staging

#### 9.3 Deploy em Produção
- [ ] Domínio: `api.delicias-da-lu.com.br`
- [ ] SSL/TLS com Let's Encrypt
- [ ] Configurar DNS
- [ ] Monitoramento e logs

**Resultado Final**: Backend em produção

---

### Fase 10: Integração Frontend (Semana 5-6)

#### 10.1 Setup do Cliente API
- [ ] `npm install axios`
- [ ] Criar `src/services/apiClient.js`
- [ ] Criar `src/services/authService.js`
- [ ] Atualizar `src/services/siteDataService.js` para usar API

#### 10.2 Integrar Services
- [ ] Criar `src/services/menuService.js`
- [ ] Criar `src/services/cakeBuilderService.js`
- [ ] Criar `src/services/ordersService.js`
- [ ] Atualizar `src/context/AdminAuthContext.jsx`

#### 10.3 Atualizar Componentes
- [ ] Menu.jsx - Usar API em vez de localStorage
- [ ] OrderBuilder.jsx - Usar API
- [ ] AdminPanel.jsx - Criar/editar/deletar via API
- [ ] Home.jsx - Dados dinâmicos via API

#### 10.4 Testar Integração
- [ ] Testar login e autenticação
- [ ] Testar listagem de menu
- [ ] Testar criação de pedido
- [ ] Testar admin operations
- [ ] Testar erros e fallbacks

**Resultado Final**: Frontend completamente integrado com backend

---

### Fase 11: Otimizações e Melhorias (Semana 6+)

#### 11.1 Performance
- [ ] Adicionar cache com Redis (opcional)
- [ ] Otimizar queries do banco
- [ ] Compressão gzip
- [ ] Lazy loading no frontend

#### 11.2 Segurança
- [ ] Rate limiting
- [ ] HTTPS em produção
- [ ] CORS bem configurado
- [ ] Validação de entrada mais rigorosa
- [ ] Sanitização de dados

#### 11.3 Monitoramento
- [ ] Logs centralizados (Sentry, LogRocket)
- [ ] Métricas de performance
- [ ] Alertas de erro
- [ ] Dashboard de status

#### 11.4 Documentação
- [ ] README.md detalhado
- [ ] Guias de deployment
- [ ] Troubleshooting
- [ ] Exemplos de uso

---

## Checklist de Tarefas

### Backend

**Semana 1:**
- [ ] Setup repositório e estrutura
- [ ] Instalar dependências
- [ ] App.js com Express setup
- [ ] Rota /health funcionando
- [ ] MongoDB/PostgreSQL instalado
- [ ] Modelos criados

**Semana 2:**
- [ ] Seed de dados
- [ ] Autenticação JWT
- [ ] Endpoint de login
- [ ] CRUD de menu 50%

**Semana 3:**
- [ ] CRUD de menu 100%
- [ ] CRUD de cake builder 100%
- [ ] Endpoints de pedidos 50%

**Semana 4:**
- [ ] Endpoints de pedidos 100%
- [ ] Contatos e configuração
- [ ] Swagger/OpenAPI completo
- [ ] Testes unitários

**Semana 5:**
- [ ] Testes de integração
- [ ] Docker configurado
- [ ] Deploy em staging
- [ ] Deploy em produção

### Frontend

**Semana 5:**
- [ ] Axios instalado
- [ ] API Client criado
- [ ] Auth Service criado
- [ ] Site Data Service atualizado

**Semana 6:**
- [ ] Menu Service integrado
- [ ] Cake Builder integrado
- [ ] Orders Service integrado
- [ ] Admin Auth Context atualizado
- [ ] Componentes atualizados
- [ ] Testes de integração

---

## Estimativa de Tempo

| Fase | Duração | Pessoa |
|------|---------|--------|
| 1. Setup Inicial | 1 dia | Backend Dev |
| 2. Banco de Dados | 2 dias | Backend Dev |
| 3. Autenticação | 1 dia | Backend Dev |
| 4. CRUD Menu | 2 dias | Backend Dev |
| 5. CRUD Cake Builder | 1 dia | Backend Dev |
| 6. Pedidos | 2 dias | Backend Dev |
| 7. Contatos/Config | 1 dia | Backend Dev |
| 8. Testes | 2 dias | QA / Backend Dev |
| 9. Docker/Deploy | 2 dias | DevOps / Backend Dev |
| 10. Integração Frontend | 3 dias | Frontend Dev |
| 11. Otimizações | 2 dias | Equipe |
| **TOTAL** | **~3 semanas** | - |

---

## Recursos Necessários

### Hardware
- Computador com 4GB RAM mínimo
- 20GB espaço livre em disco

### Software
- Node.js 18+
- Docker & Docker Compose
- MongoDB ou PostgreSQL
- Postman/Insomnia ou Thunder Client
- Git

### Serviços (Produção)
- Hosting: DigitalOcean, AWS, Heroku, Render, Railway
- Banco de dados: MongoDB Atlas, AWS RDS
- Domain: Registrar domínio se necessário
- Email: SendGrid ou similar (opcional)
- Monitoramento: Sentry, New Relic (opcional)

---

## Critérios de Sucesso

### Backend
- ✅ Todos os endpoints respondendo corretamente
- ✅ Autenticação JWT funcionando
- ✅ Validação de dados rigorosa
- ✅ Tratamento de erros consistente
- ✅ Testes com cobertura 80%+
- ✅ Documentação Swagger completa
- ✅ Rodando em Docker
- ✅ Deployado em staging e produção

### Frontend
- ✅ Login funcionando
- ✅ Menu carregando de API
- ✅ Cake Builder usando dados de API
- ✅ Criar pedidos funcionando
- ✅ Admin consegue CRUD itens
- ✅ Persistência funcionando
- ✅ Erros tratados graciosamente
- ✅ Offline mode com cache (opcional)

### Integração
- ✅ Frontend e Backend comunicando corretamente
- ✅ CORS configurado
- ✅ Autenticação funcionando end-to-end
- ✅ Performance aceitável (< 2s por requisição)
- ✅ Sem erros no console
- ✅ Testes E2E passando

---

## Próximos Passos Imediatos

### Esta semana:
1. [ ] Criar repositório backend no GitHub
2. [ ] Setup inicial com Express
3. [ ] Configurar MongoDB
4. [ ] Criar models básicos

### Próxima semana:
5. [ ] Implementar autenticação
6. [ ] CRUD de menu
7. [ ] Testes iniciais

### Semanas seguintes:
8. [ ] Cake Builder e Pedidos
9. [ ] Docker e testes
10. [ ] Deploy
11. [ ] Integração frontend

---

## Contatos e Suporte

- **Documentação**: Ver BACKEND_DOCUMENTATION.md
- **Integração Frontend**: Ver FRONTEND_API_INTEGRATION.md
- **Swagger**: http://localhost:3000/api-docs
- **GitHub**: Criar issues e discussões

---

## Notas Importantes

1. **Backup de Dados**: Sempre fazer backup antes de deletar dados em produção
2. **Versionamento**: Usar semantic versioning (v1.0.0)
3. **Breaking Changes**: Comunicar mudanças incompatíveis
4. **Rate Limiting**: Implementar proteção contra abuso
5. **Logs**: Manter logs por pelo menos 30 dias
6. **Monitoramento**: Alertas para erros críticos
7. **Segurança**: Atualizar dependências regularmente
8. **GDPR/LGPD**: Considerações de privacidade de dados

