let graph = {}; // Lista de adjacência

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
  document.getElementById("resultDisplay").textContent = "Resultado aparecerá aqui...";
}

// ====== DFS ======
function runDFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  let visited = new Set();
  let result = [];

  function dfs(v) {
    visited.add(v);
    result.push(v);
    for (let neighbor of graph[v]) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
  }

  dfs(start);
  document.getElementById("resultDisplay").textContent = `DFS: ${result.join(" → ")}`;
}

// ====== BFS ======
function runBFS() {
  const start = document.getElementById("startNode").value.trim();
  if (!graph[start]) {
    alert("Vértice inicial inválido!");
    return;
  }

  let visited = new Set([start]);
  let queue = [start];
  let result = [];

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

  document.getElementById("resultDisplay").textContent = `BFS: ${result.join(" → ")}`;
}

// ====== Finalizar ======
function exitApp() {
  if (confirm("Deseja realmente encerrar a aplicação?")) {
    clearGraph();
    alert("Aplicação finalizada!");
  }
}
