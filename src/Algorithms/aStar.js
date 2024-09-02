// aStar.js

const getNeighbors = (node, grid) => {
  const neighbors = [];
  const {row, col} = node;

  // Check all 4 directions
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

  return neighbors;
};

const heuristic = (nodeA, nodeB) => {
  const dx = Math.abs(nodeA.row - nodeB.row);
  const dy = Math.abs(nodeA.col - nodeB.col);
  return dx + dy; // Manhattan distance
};

export const aStar = (grid, startNode, finishNode) => {
  const openSet = []; // Nodes to be evaluated
  const closedSet = new Set(); // Nodes already evaluated
  const cameFrom = {}; // To reconstruct the path

  startNode.distance = 0;
  startNode.heuristic = heuristic(startNode, finishNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Get the node with the lowest f (distance + heuristic)
    openSet.sort(
      (a, b) => a.distance + a.heuristic - (b.distance + b.heuristic),
    );
    const currentNode = openSet.shift();

    if (currentNode === finishNode) {
      // Reconstruct path
      const path = [];
      let tempNode = finishNode;
      while (tempNode) {
        path.push(tempNode);
        tempNode = cameFrom[tempNode.row + ',' + tempNode.col];
      }
      return path.reverse();
    }

    closedSet.add(currentNode);

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor) || neighbor.isWall) continue;

      const tentativeDistance = currentNode.distance + 1; // Assuming each step has the same cost

      if (
        !openSet.includes(neighbor) ||
        tentativeDistance < neighbor.distance
      ) {
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = heuristic(neighbor, finishNode);
        cameFrom[neighbor.row + ',' + neighbor.col] = currentNode;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path found
  return [];
};

export const getNodesInShortestPathOrder = finishNode => {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode) {
    nodesInShortestPathOrder.push(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder.reverse();
};
