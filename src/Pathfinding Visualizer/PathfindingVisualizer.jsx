import React, {Component} from 'react';
import {
  aStar,
  getNodesInShortestPathOrder as getAStarNodesInShortestPathOrder,
} from '../Algorithms/aStar';
import {
  dijkstra,
  getNodesInShortestPathOrder as getDijkstraNodesInShortestPathOrder,
} from '../Algorithms/dijkstra';
import Node from './Node/Node';
import './PathfindingVisualizer.css';

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isStartNodeActive: false,
      isFinishNodeActive: false,
      isWallActive: false,
      startNodeRow: null,
      startNodeCol: null,
      finishNodeRow: null,
      finishNodeCol: null,
      visitedNodesInOrder: [],
      nodesInShortestPathOrder: [],
    };
  }

  activateStartNode() {
    this.setState({
      isStartNodeActive: true,
      isFinishNodeActive: false,
      isWallActive: false,
    });
  }

  activateFinishNode() {
    this.setState({
      isStartNodeActive: false,
      isFinishNodeActive: true,
      isWallActive: false,
    });
  }

  activateWall() {
    this.setState({
      isStartNodeActive: false,
      isFinishNodeActive: false,
      isWallActive: true,
    });
  }

  resetGrid() {
    const grid = getInitialGrid();
    document.querySelectorAll('.node').forEach(node => {
      node.classList.remove('node-visited', 'node-shortest-path', 'node-wall');
    });
    this.setState({
      grid,
      startNodeRow: null,
      startNodeCol: null,
      finishNodeRow: null,
      finishNodeCol: null,
      isStartNodeActive: false,
      isFinishNodeActive: false,
      isWallActive: false,
      visitedNodesInOrder: [],
      nodesInShortestPathOrder: [],
    });
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if (this.state.isStartNodeActive) {
      this.setState(prevState => {
        const newGrid = getNewGridWithStartNode(prevState.grid, row, col);
        return {
          grid: newGrid,
          isStartNodeActive: false,
          startNodeRow: row,
          startNodeCol: col,
        };
      });
    } else if (this.state.isFinishNodeActive) {
      this.setState(prevState => {
        const newGrid = getNewGridWithFinishNode(prevState.grid, row, col);
        return {
          grid: newGrid,
          isFinishNodeActive: false,
          finishNodeRow: row,
          finishNodeCol: col,
        };
      });
    } else if (this.state.isWallActive) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    document
      .querySelectorAll('.node-visited, .node-shortest-path')
      .forEach(node => {
        node.classList.remove('node-visited', 'node-shortest-path');
      });

    // Animate visited nodes
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeAlgorithm() {
    const {grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol} =
      this.state;
    const {selectedAlgorithm} = this.props;

    if (
      startNodeRow === null ||
      finishNodeRow === null ||
      startNodeCol === null ||
      finishNodeCol === null
    ) {
      alert('Please set both start and finish nodes before visualizing.');
      return;
    }

    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];

    let visitedNodesInOrder, nodesInShortestPathOrder;

    if (selectedAlgorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder =
        getDijkstraNodesInShortestPathOrder(finishNode);
    } else if (selectedAlgorithm === 'aStar') {
      visitedNodesInOrder = aStar(grid, startNode, finishNode);
      nodesInShortestPathOrder = getAStarNodesInShortestPathOrder(finishNode);
    }

    this.clearAnimations();
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearAnimations() {
    document
      .querySelectorAll('.node-visited, .node-shortest-path')
      .forEach(node => {
        node.classList.remove('node-visited', 'node-shortest-path');
      });
  }

  setAlgorithm(algorithm) {
    this.setState({selectedAlgorithm: algorithm});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartNode = (grid, row, col) => {
  const newGrid = grid.slice();
  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[0].length; c++) {
      if (newGrid[r][c].isStart) {
        newGrid[r][c] = {...newGrid[r][c], isStart: false};
        break;
      }
    }
  }
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithFinishNode = (grid, row, col) => {
  const newGrid = grid.slice();
  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[0].length; c++) {
      if (newGrid[r][c].isFinish) {
        newGrid[r][c] = {...newGrid[r][c], isFinish: false};
        break;
      }
    }
  }
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default PathfindingVisualizer;
