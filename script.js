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
function runDFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  stopAnimation();
  resetNodeColors();

  let visited = new Set();
  let result = [];
  let step = 0;
  const speed = parseInt(document.getElementById("speedControl").value);

  function dfs(v) {
    visited.add(v);
    result.push(v);

    // Animar nó atual
    const timeout1 = setTimeout(() => {
      svg
        .selectAll(".node")
        .filter((d) => d.id === v)
        .attr("class", "node node-current");
    }, step * speed);
    animationTimeouts.push(timeout1);
    step++;

    // Marcar como visitado após um delay
    const timeout2 = setTimeout(() => {
      svg
        .selectAll(".node")
        .filter((d) => d.id === v)
        .attr("class", "node node-visited");
    }, step * speed);
    animationTimeouts.push(timeout2);

    for (let neighbor of graph[v]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);

  // Mostrar resultado final
  const finalTimeout = setTimeout(() => {
    document.getElementById("resultDisplay").textContent = `DFS: ${result.join(
      " → "
    )}`;
  }, (step + 1) * speed);
  animationTimeouts.push(finalTimeout);
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
