# 📁 Estrutura de Imagens - Delícias da Lú

## 📂 Organização das Pastas

```
public/images/
├── bolos/              # Imagens dos bolos (home destaques + cardápio)
│   ├── ninho-nutella.jpg
│   ├── floresta-negra.jpg
│   ├── redvelvet.jpg
│   └── chocolate-brigadeiro-gourmet.jpg
│
├── massas/             # Imagens das opções de massa
│   ├── branca.jpg
│   ├── chocolate.jpg
│   ├── redvelvet.jpg
│   └── ninho.jpg
│
├── recheios/           # Imagens das opções de recheio
│   ├── nutella.jpg
│   ├── chocolate.jpg
│   ├── brigadeiro.jpg
│   ├── ninho.jpg
│   └── frutas/
│       ├── abacaxi.jpg
│       ├── morango.jpg
│       └── maracuja.jpg
│
├── coberturas/         # Imagens das opções de cobertura
│   ├── ganache.jpg
│   ├── calda.jpg
│   └── chantilly.jpg
│
├── decoracoes/         # Imagens das opções de decoração
│   ├── raspas-chocolate.jpg
│   ├── frutas-frescas.jpg
│   ├── papel-arroz.jpg
│   └── toppers.jpg
│
├── doces/              # Imagens dos docinhos (doces simples e finos)
│   ├── brigadeiro.jpg
│   ├── beijinho.jpg
│   ├── bicho-de-pe.jpg
│   ├── cajuzinho.jpg
│   └── finos/
│       ├── camafeu.jpg
│       ├── copinho-chocolate.jpg
│       ├── mini-trufas.jpg
│       └── bem-casado.jpg
│
└── instagram/          # Imagens do feed do Instagram (estáticas)
    ├── post-1.jpg
    ├── post-2.jpg
    ├── post-3.jpg
    ├── post-4.jpg
    ├── post-5.jpg
    └── post-6.jpg
```

## 🔗 Como Usar as Imagens

### 1. Imagens em Componentes React
```jsx
// Caminho relativo a partir de public/
<img src="/images/bolos/ninho-nutella.jpg" alt="Ninho com Nutella" />
```

### 2. Imagens em Arquivos de Configuração
```javascript
// Em src/config/menu.js ou src/config/cakeBuilder.js
{
  id: 'branca',
  label: 'Massa Branca',
  image: '/images/massas/branca.jpg'
}
```

### 3. Imagens no CSS (Tailwind)
```jsx
<div style={{ backgroundImage: 'url(/images/bolos/ninho-nutella.jpg)' }} />
```

## 📋 Checklist de Implementação

- [ ] Adicionar imagens dos 4 bolos destacados (home)
- [ ] Adicionar imagens das massas (branca, chocolate, redvelvet, ninho)
- [ ] Adicionar imagens dos recheios principais
- [ ] Adicionar imagens das coberturas
- [ ] Adicionar imagens das decorações
- [ ] Adicionar imagens dos docinhos (simples e finos)
- [ ] Adicionar imagens do feed do Instagram
- [ ] Atualizar config files com referências de imagem
- [ ] Testar carregamento de imagens em todas as páginas

## 📸 Recomendações

- **Tamanho**: Manter 500x500px para bolos, 300x300px para extras
- **Formato**: JPG para fotos, PNG para elementos com transparência
- **Otimização**: Comprimir antes de commitar (máx 200KB por imagem)
- **Nomes**: Sempre minúsculas, sem espaços, usar hífen

## 🎯 Próximos Passos

Após adicionar as imagens, atualizar:
1. `src/config/menu.js` - adicionar campo `image` a cada item
2. `src/config/cakeBuilder.js` - adicionar campo `image` aos componentes
3. `src/pages/Home.jsx` - usar imagens nas destaques
4. `src/pages/Menu.jsx` - exibir imagens no cardápio
5. `src/pages/OrderBuilder.jsx` - exibir imagens nas opções
