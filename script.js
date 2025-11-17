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
  if (!input) return;

  const [from, to] = input.split(" ");
  if (!from || !to) {
    alert("Formato inválido! Use: Origem Destino");
    return;
  }

  if (!graph[from]) graph[from] = [];
  if (!graph[to]) graph[to] = [];

  graph[from].push(to);
  graph[to].push(from); // Grafo não direcionado

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
    svg.selectAll(".level-label").remove(); // Remover labels de nível
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

// Função de ordenação alfanumérica
function sortNeighbors(neighbors) {
  return neighbors.slice().sort((a, b) => {
    // Verifica se são números
    const aIsNum = !isNaN(a);
    const bIsNum = !isNaN(b);

    if (aIsNum && bIsNum) {
      // Ambos são números - ordenação numérica
      return Number(a) - Number(b);
    } else if (!aIsNum && !bIsNum) {
      // Ambos são strings - ordenação alfabética
      return a.localeCompare(b);
    } else {
      // Misturado - números primeiro
      return aIsNum ? -1 : 1;
    }
  });
}

// ====== DFS (Iterativo com Pilha - Todas as Componentes) ======
function runDFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  stopAnimation();
  resetNodeColors();

  let visited = new Set();
  let resultComponents = [];
  let step = 0;
  const speed = parseInt(document.getElementById("speedControl").value);

  // Função auxiliar para DFS iterativo em uma componente
  function dfsIterative(startVertex) {
    let stack = [startVertex];
    let component = [];
    visited.add(startVertex);

    while (stack.length > 0) {
      let current = stack.pop();
      component.push(current);

      // Animar nó atual (sendo processado)
      const currentVertex = current;
      const timeout1 = setTimeout(() => {
        svg
          .selectAll(".node")
          .filter((d) => d.id === currentVertex)
          .attr("class", "node node-current");
      }, step * speed);
      animationTimeouts.push(timeout1);
      step++;

      // Marcar como visitado após um delay
      const timeout2 = setTimeout(() => {
        svg
          .selectAll(".node")
          .filter((d) => d.id === currentVertex)
          .attr("class", "node node-visited");
      }, step * speed);
      animationTimeouts.push(timeout2);

      // Adicionar vizinhos não visitados à pilha (ordenados)
      const sortedNeighbors = sortNeighbors(graph[current]);
      for (let neighbor of sortedNeighbors.reverse()) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          visited.add(neighbor);
        }
      }
      step++;
    }

    return component;
  }

  // Primeira componente a partir do nó inicial
  let mainComponent = dfsIterative(start);
  resultComponents.push(mainComponent);

  // DFS em outros componentes desconectados (ordenados)
  const sortedVertices = sortNeighbors(Object.keys(graph));
  for (let vertex of sortedVertices) {
    if (!visited.has(vertex)) {
      let newComponent = dfsIterative(vertex);
      resultComponents.push(newComponent);
    }
  }

  // Mostrar resultado final
  const finalTimeout = setTimeout(() => {
    const formatted = resultComponents
      .map((comp) => comp.join(" → "))
      .join("  |  ");
    document.getElementById(
      "resultDisplay"
    ).textContent = `DFS (Iterativo): ${formatted}`;
  }, (step + 1) * speed);
  animationTimeouts.push(finalTimeout);
}

// ====== BFS (Com Detecção de Componentes) ======
function runBFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  stopAnimation();
  resetNodeColors();

  let visited = new Set();
  let resultComponents = [];
  let step = 0;
  const speed = parseInt(document.getElementById("speedControl").value);

  // Função auxiliar para BFS em uma componente
  function bfsIterative(startVertex) {
    let queue = [[startVertex, 0]]; // [vértice, nível]
    let component = [];
    let levels = {};

    visited.add(startVertex);
    levels[startVertex] = 0;

    // Marcar nó inicial como visitando
    const timeout0 = setTimeout(() => {
      svg
        .selectAll(".node")
        .filter((d) => d.id === startVertex)
        .attr("class", "node node-visiting");
    }, step * speed);
    animationTimeouts.push(timeout0);
    step++;

    while (queue.length > 0) {
      let [vertex, level] = queue.shift();
      component.push({ vertex, level });

      // Marcar nó atual como corrente
      const currentVertex = vertex;
      const currentLevel = level;
      const timeout1 = setTimeout(() => {
        svg
          .selectAll(".node")
          .filter((d) => d.id === currentVertex)
          .attr("class", "node node-current");

        // Adicionar label de nível no nó
        svg
          .selectAll(".node")
          .filter((d) => d.id === currentVertex)
          .append("text")
          .attr("class", "level-label")
          .attr("y", 35)
          .attr("fill", "#2c3e50")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`Nível ${currentLevel}`);
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

      // Processar vizinhos ordenados
      const sortedNeighbors = sortNeighbors(graph[vertex]);
      for (let neighbor of sortedNeighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          levels[neighbor] = level + 1;
          queue.push([neighbor, level + 1]);

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

    return component;
  }

  // Primeira componente a partir do nó inicial
  let mainComponent = bfsIterative(start);
  resultComponents.push(mainComponent);

  // BFS em outros componentes desconectados (ordenados)
  const sortedVertices = sortNeighbors(Object.keys(graph));
  for (let vertex of sortedVertices) {
    if (!visited.has(vertex)) {
      let newComponent = bfsIterative(vertex);
      resultComponents.push(newComponent);
    }
  }

  // Mostrar resultado final com níveis
  const finalTimeout = setTimeout(() => {
    const componentsFormatted = resultComponents.map((component) => {
      const path = component.map((item) => item.vertex).join(" → ");
      const levelInfo = component
        .map((item) => `${item.vertex}(N${item.level})`)
        .join(" → ");

      // Agrupar por níveis
      const levelGroups = {};
      component.forEach((item) => {
        if (!levelGroups[item.level]) {
          levelGroups[item.level] = [];
        }
        levelGroups[item.level].push(item.vertex);
      });

      const levelDisplay = Object.entries(levelGroups)
        .map(
          ([level, vertices]) => `    Nível ${level}: ${vertices.join(", ")}`
        )
        .join("\n");

      return `${path}\n  Com níveis: ${levelInfo}\n${levelDisplay}`;
    });

    const finalResult = componentsFormatted.join(
      "\n\n  ---Componente Separada---\n\n"
    );

    document.getElementById(
      "resultDisplay"
    ).textContent = `BFS:\n\n${finalResult}`;
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
