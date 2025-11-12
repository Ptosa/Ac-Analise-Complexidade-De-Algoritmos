# 📊 Visualizador de Grafos - DFS e BFS

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)

Uma aplicação web interativa para visualizar e compreender os algoritmos de busca em profundidade (DFS) e busca em largura (BFS) em grafos.

[Demonstração](#-demonstração) • [Instalação](#-instalação) • [Como Usar](#-como-usar) • [Tecnologias](#-tecnologias) • [Funcionalidades](#-funcionalidades)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Demonstração](#-demonstração)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Algoritmos Implementados](#-algoritmos-implementados)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Exemplos de Grafos](#-exemplos-de-grafos)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido para facilitar o aprendizado e a compreensão dos algoritmos de busca em grafos, especificamente **DFS (Depth-First Search)** e **BFS (Breadth-First Search)**. 

A aplicação oferece uma interface visual interativa onde é possível:
- Construir grafos não direcionados de forma intuitiva
- Visualizar a estrutura do grafo em tempo real
- Executar algoritmos DFS e BFS com animações passo a passo
- Controlar a velocidade das animações
- Entender claramente como cada algoritmo percorre o grafo

### 🎓 Objetivo Educacional

Ideal para estudantes de Ciência da Computação, Engenharia de Software e áreas relacionadas que desejam visualizar e compreender melhor:
- Estruturas de dados de grafos
- Algoritmos de travessia
- Análise de complexidade de algoritmos
- Diferenças práticas entre DFS e BFS

---

## 🎬 Demonstração

### Interface Principal

A aplicação possui uma interface limpa e intuitiva dividida em seções:

1. **Seção de Inserção de Arestas**: Construa seu grafo adicionando conexões entre vértices
2. **Lista de Adjacência**: Visualize a representação em lista do grafo
3. **Visualização Gráfica**: Veja o grafo renderizado com D3.js
4. **Controles de Algoritmo**: Execute DFS ou BFS e controle a animação
5. **Resultado**: Acompanhe a ordem de visitação dos nós

### Código de Cores

- 🔵 **Azul** - Nó não visitado
- 🟠 **Laranja** - Nó na fila (BFS)
- 🔴 **Vermelho** - Nó sendo visitado no momento
- 🟢 **Verde** - Nó já visitado

---

## ✨ Funcionalidades

### 🎨 Visualização Interativa
- **Renderização Dinâmica**: Grafo desenhado automaticamente usando D3.js force simulation
- **Nós Arrastáveis**: Reorganize o layout do grafo arrastando os nós
- **Layout Automático**: Algoritmo de força que distribui os nós de forma equilibrada
- **Área de Visualização Responsiva**: 500px de altura com redimensionamento automático

### 🎭 Animações
- **DFS Animado**: Visualize a busca em profundidade em ação
  - Destaque do nó atual em vermelho
  - Nós visitados ficam verdes
  - Animação sequencial mostrando a recursão
  
- **BFS Animado**: Visualize a busca em largura por níveis
  - Nós na fila destacados em laranja
  - Nó sendo processado em vermelho
  - Camadas de busca claramente visíveis

### ⚙️ Controles Personalizáveis
- **Velocidade Ajustável**: Slider de 100ms a 2000ms por passo
- **Pausa de Animação**: Botão para interromper a execução
- **Reset Automático**: Limpeza ao iniciar nova busca

### 📊 Recursos Adicionais
- **Lista de Adjacência**: Representação textual do grafo
- **Ordem de Visitação**: Resultado exibido em formato de caminho
- **Validação de Entrada**: Alertas para entradas inválidas
- **Grafos Não Direcionados**: Arestas bidirecionais automáticas

---

## 🛠️ Tecnologias

### Frontend
- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização moderna com Flexbox
- **JavaScript (ES6+)**: Lógica da aplicação e algoritmos

### Bibliotecas
- **D3.js v7**: Visualização de dados e renderização SVG
  - Force Simulation para layout de grafos
  - Drag and Drop para interatividade
  - Transições suaves de animação

### Estrutura de Dados
- **Lista de Adjacência**: Representação eficiente do grafo usando objeto JavaScript
- **Set**: Para controle de nós visitados
- **Array**: Para fila (BFS) e pilha de recursão (DFS)

---

## 📥 Instalação

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Não requer Node.js ou dependências externas

### Opção 1: Abrir Diretamente

```bash
# Clone o repositório
git clone https://github.com/Ptosa/Ac-Analise-Complexidade-De-Algoritmos.git

# Entre no diretório
cd Ac-Analise-Complexidade-De-Algoritmos

# Abra o index.html no navegador
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Opção 2: Usar Live Server (VS Code)

1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"
4. Acesse `http://localhost:5500`

### Opção 3: Servidor HTTP Local

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

---

## 📖 Como Usar

### 1️⃣ Construindo o Grafo

1. **Digite uma aresta** no formato: `Origem Destino`
   - Exemplo: `A B` (cria conexão entre A e B)
   - Vértices podem ser letras (A, B, C) ou números (1, 2, 3)

2. **Clique em "Adicionar Aresta"** para criar a conexão

3. **Repita o processo** para adicionar mais arestas

4. **Visualize** o grafo sendo construído em tempo real

### 2️⃣ Executando os Algoritmos

1. **Digite o vértice inicial** (ex: `A`)

2. **Escolha o algoritmo**:
   - Clique em "Executar DFS" para busca em profundidade
   - Clique em "Executar BFS" para busca em largura

3. **Ajuste a velocidade** usando o slider (opcional)

4. **Observe a animação** passo a passo

5. **Veja o resultado** da ordem de visitação

### 3️⃣ Controles Adicionais

- **Parar Animação**: Interrompe a execução atual
- **Limpar Grafo**: Remove todas as arestas e reseta a visualização
- **Finalizar Aplicação**: Encerra e limpa todos os dados

---

## 🧮 Algoritmos Implementados

### DFS - Busca em Profundidade

**Complexidade de Tempo**: O(V + E)
**Complexidade de Espaço**: O(V)

```javascript
function dfs(vertex) {
    visited.add(vertex);
    result.push(vertex);
    
    for (let neighbor of graph[vertex]) {
        if (!visited.has(neighbor)) {
            dfs(neighbor);  // Recursão
        }
    }
}
```

**Características**:
- Usa recursão (pilha implícita)
- Explora o máximo de profundidade antes de retroceder
- Útil para: detecção de ciclos, ordenação topológica, encontrar componentes conectados

### BFS - Busca em Largura

**Complexidade de Tempo**: O(V + E)
**Complexidade de Espaço**: O(V)

```javascript
function bfs(start) {
    let queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        let vertex = queue.shift();
        result.push(vertex);
        
        for (let neighbor of graph[vertex]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}
```

**Características**:
- Usa fila (FIFO)
- Explora por níveis/camadas
- Útil para: menor caminho em grafos não ponderados, encontrar vizinhança

---

## 📁 Estrutura do Projeto

```
Ac-Analise-Complexidade-De-Algoritmos/
│
├── index.html          # Estrutura HTML da aplicação
├── style.css           # Estilos e layout
├── script.js           # Lógica dos algoritmos e visualização
└── README.md           # Documentação do projeto
```

### Arquivos Principais

#### `index.html`
- Estrutura semântica da página
- Seções de entrada, visualização e controles
- Integração com D3.js via CDN
- Legenda visual de cores

#### `style.css`
- Layout responsivo (max-width: 1200px)
- Estilos para SVG e elementos do grafo
- Classes para estados dos nós
- Animações e transições CSS
- Design limpo e profissional

#### `script.js`
- **Variáveis globais**: graph, simulation, svg, animationTimeouts
- **Funções principais**:
  - `addEdge()`: Adiciona aresta ao grafo
  - `visualizeGraph()`: Renderiza grafo com D3.js
  - `runDFS()`: Executa busca em profundidade animada
  - `runBFS()`: Executa busca em largura animada
  - `stopAnimation()`: Para animação em execução
  - `clearGraph()`: Limpa o grafo completamente

---

## 🎓 Exemplos de Grafos

### Exemplo 1: Grafo em Árvore

```
    A --- B --- C
    |     |
    D --- E
          |
          F
```

**Arestas**:
```
A B
A D
B C
B E
D E
E F
```

**Teste**:
- Vértice inicial: `A`
- DFS: A → B → C → E → D → F (ou variação)
- BFS: A → B → D → C → E → F

### Exemplo 2: Grafo Hexagonal

```
      A
     / \
    B   C
    |   |
    D   E
     \ /
      F
```

**Arestas**:
```
A B
A C
B D
C E
D F
E F
```

**Teste**:
- Vértice inicial: `A`
- DFS: A → B → D → F → E → C
- BFS: A → B → C → D → E → F

### Exemplo 3: Grafo com Ciclo

```
    A --- B
    |     |
    D --- C
```

**Arestas**:
```
A B
B C
C D
D A
```

**Teste**:
- Demonstra como os algoritmos evitam revisitar nós
- Ideal para entender controle de visitação

---

## 🎨 Personalização

### Modificar Cores dos Nós

Edite as classes CSS em `style.css`:

```css
.node-default circle { fill: #3498db; }    /* Azul - não visitado */
.node-visiting circle { fill: #f39c12; }   /* Laranja - na fila */
.node-current circle { fill: #e74c3c; }    /* Vermelho - atual */
.node-visited circle { fill: #27ae60; }    /* Verde - visitado */
```

### Ajustar Tamanho dos Nós

Em `script.js`, modifique o raio dos círculos:

```javascript
node.append("circle").attr("r", 25);  // Raio padrão: 25px
```

### Modificar Força da Simulação

Ajuste os parâmetros do force simulation:

```javascript
simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))  // Distância
    .force("charge", d3.forceManyBody().strength(-300))               // Repulsão
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40));                // Colisão
```

---

## 🔍 Conceitos de Análise de Complexidade

### Notação Big O

Ambos os algoritmos têm:
- **Tempo**: O(V + E) onde V = vértices, E = arestas
- **Espaço**: O(V) para armazenar nós visitados

### Comparação DFS vs BFS

| Aspecto | DFS | BFS |
|---------|-----|-----|
| Estrutura | Pilha (recursão) | Fila |
| Memória | O(h) altura da árvore | O(w) largura máxima |
| Uso | Ciclos, componentes | Menor caminho |
| Ordem | Profundidade primeiro | Nível por nível |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Ideias para Contribuição

- [ ] Adicionar suporte para grafos direcionados
- [ ] Implementar grafos ponderados
- [ ] Adicionar algoritmo de Dijkstra
- [ ] Exportar grafo como imagem
- [ ] Modo escuro
- [ ] Exemplos pré-carregados
- [ ] Tutorial interativo
- [ ] Testes unitários

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

**Projeto Acadêmico** - Análise de Complexidade de Algoritmos

---

## 🙏 Agradecimentos

- [D3.js](https://d3js.org/) - Biblioteca de visualização de dados
- [MDN Web Docs](https://developer.mozilla.org/) - Documentação de referência
- Comunidade de desenvolvedores que contribuem com conhecimento open source

---

## 📞 Contato

Para dúvidas, sugestões ou feedback:

- **Repositório**: [Ac-Analise-Complexidade-De-Algoritmos](https://github.com/Ptosa/Ac-Analise-Complexidade-De-Algoritmos)
- **Issues**: [Reportar Problema](https://github.com/Ptosa/Ac-Analise-Complexidade-De-Algoritmos/issues)

---

<div align="center">

**Desenvolvido com ❤️ para facilitar o aprendizado de algoritmos**

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

</div>
