let graph = {}; // Lista de adjacência
let simulation = null; // Simulação D3
let svg = null; // SVG para visualização
let animationTimeouts = []; // Para controlar animações

// Inicializar SVG
function initSVG() {
  const container = document.getElementById("graphVisualization");
  container.innerHTML = ""; // Limpar conteúdo anterior

  svg = d3
    .select("#graphVisualization")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
}

function addEdge() {
  const input = document.getElementById("edgeInput").value.trim();
  const isDirected = document.getElementById("directedCheckbox").checked;

  if (!input) return;

  const [from, to] = input.split(" ");
  if (!from || !to) {
    alert("Formato inválido! Use: Origem Destino");
    return;
  }

  if (!graph[from]) graph[from] = [];
  if (!graph[to]) graph[to] = [];

  graph[from].push(to);
  if (!isDirected) {
    graph[to].push(from); // Só adiciona a volta se for não-direcionado
  }

  document.getElementById("edgeInput").value = "";
  updateGraphDisplay();
  visualizeGraph(); // Atualizar visualização
}

function updateGraphDisplay() {
  const display = Object.entries(graph)
    .map(([v, adj]) => `${v}: ${adj.join(", ")}`)
    .join("\n");
  document.getElementById("adjListDisplay").textContent = display || "[Vazio]";
}

function clearGraph() {
  graph = {};
  document.getElementById("adjListDisplay").textContent = "[Vazio]";
  document.getElementById("resultDisplay").textContent =
    "Resultado aparecerá aqui...";
  stopAnimation();
  if (svg) {
    svg.selectAll("*").remove();
  }
}

// ====== Visualização D3.js ======
function visualizeGraph() {
  if (!svg) initSVG();

  stopAnimation();
  svg.selectAll("*").remove();

  if (Object.keys(graph).length === 0) return;

  const container = document.getElementById("graphVisualization");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Preparar dados para D3
  const nodes = Object.keys(graph).map((id) => ({ id }));
  const links = [];
  const addedLinks = new Set();

  Object.entries(graph).forEach(([source, targets]) => {
    targets.forEach((target) => {
      const linkId = [source, target].sort().join("-");
      if (!addedLinks.has(linkId)) {
        links.push({ source, target });
        addedLinks.add(linkId);
      }
    });
  });

  // Force simulation
  simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40));

  // Desenhar arestas
  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");

  // Desenhar nós
  const node = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node node-default")
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  node.append("circle").attr("r", 25);

  node
    .append("text")
    .text((d) => d.id)
    .attr("fill", "white");

  // Atualizar posições
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  // Funções de drag
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Resetar cores dos nós
function resetNodeColors() {
  if (svg) {
    svg.selectAll(".node").attr("class", "node node-default");
  }
}

// Controle de velocidade
document.getElementById("speedControl").addEventListener("input", (e) => {
  document.getElementById("speedValue").textContent = e.target.value + "ms";
});

// Parar animação
function stopAnimation() {
  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationTimeouts = [];
  resetNodeColors();
}

// ====== DFS ======
// Função para "pausar" entre etapas
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  stopAnimation();
  resetNodeColors();

  const speed = parseInt(document.getElementById("speedControl").value);
  const visited = new Set();
  const firstVisit = {};
  const lastVisit = {};
  let time = 0;
  let result = [];

  // 🔹 Função recursiva assíncrona
  async function dfs(node) {
    visited.add(node);
    firstVisit[node] = ++time;
    result.push(node);

    // Marcar como "visitando"
    svg.selectAll(".node")
      .filter(d => d.id === node)
      .attr("class", "node node-current");

    await sleep(speed);

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        await dfs(neighbor);
      }
    }

    lastVisit[node] = ++time;
    svg.selectAll(".node")
      .filter(d => d.id === node)
      .attr("class", "node node-visited");

    await sleep(speed);
  }

  // 🔹 Executar DFS e mostrar resultado
  await dfs(start);

  // Mostrar resultado textual
  let resultText = "DFS: " + result.join(" → ") + "\n\n";
  resultText += "Tempos de visita:\n";
  Object.keys(firstVisit).forEach(v => {
    resultText += `${v}: first=${firstVisit[v]}, last=${lastVisit[v]}\n`;
  });

  document.getElementById("resultDisplay").textContent = resultText;
}
// Visualizar árvore DFS em SVG separado
function gerarArvoreDFS(start, parent, first, last) {
  // Montar estrutura pai → filhos
  let children = {};
  for (let [node, p] of Object.entries(parent)) {
    if (p !== null) {
      if (!children[p]) children[p] = [];
      children[p].push(node);
    }
  }

  // Função recursiva para imprimir a árvore
  function printSubtree(node, prefix = "") {
    let text = `${prefix}${node} (first=${first[node]}, last=${last[node]})\n`;
    const subs = children[node] || [];
    for (let i = 0; i < subs.length; i++) {
      const isLast = i === subs.length - 1;
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      text += prefix + (isLast ? "└── " : "├── ") + printSubtree(subs[i], newPrefix);
    }
    return text;
  }

  return printSubtree(start);
}
function visualizarArvoreDFS(start, parent, first, last) {
  const container = d3.select("#dfsTreeContainer");
  container.selectAll("*").remove();

  // Montar estrutura pai → filhos
  let children = {};
  for (let [node, p] of Object.entries(parent)) {
    if (p !== null) {
      if (!children[p]) children[p] = [];
      children[p].push(node);
    }
  }

  // Converter em estrutura hierárquica para D3
  function buildTree(node) {
    return {
      name: node,
      first: first[node],
      last: last[node],
      children: (children[node] || []).map(buildTree)
    };
  }

  const treeData = buildTree(start);

  // Dimensões do SVG
  const width = container.node().clientWidth;
  const height = container.node().clientHeight;

  const svgTree = container.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(50,50)");

  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([height - 100, width - 200]);
  treeLayout(root);

  // Links (conexões)
  svgTree.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y))
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

  // Nós
  const node = svgTree.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
    .attr("r", 25)
    .attr("fill", "#3498db")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

  node.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-weight", "bold")
    .text(d => d.data.name);

  node.append("text")
    .attr("dy", 35)
    .attr("text-anchor", "middle")
    .attr("fill", "#333")
    .style("font-size", "12px")
    .text(d => `(${d.data.first}, ${d.data.last})`);
}


// ====== BFS ======
function runBFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  stopAnimation();
  resetNodeColors();

  let visited = new Set([start]);
  let queue = [start];
  let result = [];
  let step = 0;
  const speed = parseInt(document.getElementById("speedControl").value);

  // Marcar nó inicial como visitando
  const timeout0 = setTimeout(() => {
    svg
      .selectAll(".node")
      .filter((d) => d.id === start)
      .attr("class", "node node-visiting");
  }, step * speed);
  animationTimeouts.push(timeout0);
  step++;

  while (queue.length > 0) {
    let vertex = queue.shift();
    result.push(vertex);

    // Marcar nó atual como corrente
    const currentVertex = vertex;
    const timeout1 = setTimeout(() => {
      svg
        .selectAll(".node")
        .filter((d) => d.id === currentVertex)
        .attr("class", "node node-current");
    }, step * speed);
    animationTimeouts.push(timeout1);
    step++;

    // Marcar como visitado
    const timeout2 = setTimeout(() => {
      svg
        .selectAll(".node")
        .filter((d) => d.id === currentVertex)
        .attr("class", "node node-visited");
    }, step * speed);
    animationTimeouts.push(timeout2);

    for (let neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        // Marcar vizinho como visitando (na fila)
        const neighborNode = neighbor;
        const timeout3 = setTimeout(() => {
          svg
            .selectAll(".node")
            .filter((d) => d.id === neighborNode)
            .attr("class", "node node-visiting");
        }, step * speed);
        animationTimeouts.push(timeout3);
      }
    }
    step++;
  }

  // Mostrar resultado final
  const finalTimeout = setTimeout(() => {
    document.getElementById("resultDisplay").textContent = `BFS: ${result.join(
      " → "
    )}`;
  }, (step + 1) * speed);
  animationTimeouts.push(finalTimeout);
}



// ====== Finalizar ======
function exitApp() {
  if (confirm("Deseja realmente encerrar a aplicação?")) {
    clearGraph();
    alert("Aplicação finalizada!");
  }
}

// Inicializar SVG ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  initSVG();
});
