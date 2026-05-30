# 🍰 Delícias da Lú - Website E-Commerce

Website completo de e-commerce para confeitaria artesanal desenvolvido com **React + Tailwind CSS + Vite**.

## 🚀 Quick Start

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3001

### Build
```bash
npm run build
```

## 📁 Estrutura

```
src/
├── config/                 # Configurações centralizadas (IMPORTANTE!)
│   ├── contacts.js        # WhatsApp, email, localização
│   ├── menu.js            # Todos os produtos
│   ├── cakeBuilder.js     # Opções do Cake Builder
│   ├── branding.js        # Cores e fontes
│   └── index.js           # Exporta tudo
├── context/
│   └── CartContext.jsx    # Estado global
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CartSidebar.jsx
│   └── FloatingWhatsAppButton.jsx
└── pages/
    ├── Home.jsx
    ├── Menu.jsx
    ├── OrderBuilder.jsx
    ├── AboutUs.jsx
    └── Contact.jsx
```

## ⚙️ Configuração

**Todos os dados estão em `src/config/`**

- **contacts.js**: WhatsApp, email, Instagram, Google Maps
- **menu.js**: Produtos (Bolos, Doces Simples, Doces Finos, Decorações)
- **cakeBuilder.js**: Opções de tamanho, massa, recheio, cobertura, decoração
- **branding.js**: Cores, tipografia

Para alterar qualquer coisa, edite esses arquivos!

## 📞 Contatos

- **WhatsApp**: +55 (11) 945-7541-50
- **Email**: gab.ponsoni@gmail.com
- **Instagram**: @deliciasda.lu.oficial

## 🚢 Deploy

1. `npm run build`
2. Upload de `dist/` para Vercel, Netlify ou seu servidor

---

**Versão**: 1.0  
**Desenvolvido por**: GitHub Copilot CLI
