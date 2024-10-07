import React, {Component} from 'react';
import styled from 'styled-components';
import Node from './Node/Node';
import {
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  handleResize,
  handleStop,
} from './components/Handlers';

import Animation from './components/Animations';

class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    const numColumns = this.calculateNumColumns();
    this.state = {
      grid: this.createGrid(numColumns),
      numColumns: numColumns,
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
    this.animation = new Animation();
    this.pathfindingVisualizerRef = React.createRef();
    this.animationId = null;
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
    const grid = this.createGrid(this.state.numColumns);
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
    const grid = this.createGrid(this.state.numColumns);
    this.setState({grid});
    window.addEventListener('resize', handleResize);

    if (this.pathfindingVisualizerRef.current) {
      this.pathfindingVisualizerRef.current.handleStop = handleStop;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', handleResize);
  }

  calculateNumColumns() {
    const gridWidth = window.innerWidth;
    const columnWidth = 30; // Width of each column in pixels
    return Math.max(Math.floor(gridWidth / columnWidth), 10); // Minimum 10 columns
  }

  createGrid(numColumns) {
    const grid = [];
    const numRows = 20; // Set the number of rows
    for (let row = 0; row < numRows; row++) {
      const currentRow = [];
      for (let col = 0; col < numColumns; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row) {
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
  }

  visualizeAlgorithm() {
    const {grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol} =
      this.state;
    const {selectedAlgorithm} = this.props;

    this.animation.visualizeAlgorithm(
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
      selectedAlgorithm,
    );
  }

  stopVisualization = () => {
    this.animation.stopVisualization(); // Call the stopVisualization method from Animation
  };

  clearAnimations() {
    this.animation.clearAnimations(); // Clear animations using Animation instance
  }

  setAlgorithm(algorithm) {
    this.setState({selectedAlgorithm: algorithm});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <Grid>
          {grid.map((row, rowIdx) => (
            <GridRow key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall, isStop} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isStop={isStop}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={() =>
                      handleMouseDown(
                        row,
                        col,
                        this.state,
                        this.setState.bind(this),
                      )
                    }
                    onMouseEnter={() =>
                      handleMouseEnter(
                        row,
                        col,
                        this.state,
                        this.setState.bind(this),
                      )
                    }
                    onMouseUp={() => handleMouseUp(this.setState.bind(this))}
                    row={row}
                  />
                );
              })}
            </GridRow>
          ))}
        </Grid>
      </>
    );
  }
}

export default PathfindingVisualizer;

const GridRow = styled.div`
  display: block;
`;

const Grid = styled.div`
  display: grid;
  padding: 5%;
  grid-template-columns: repeat(auto-fill, minmax(27px, 1fr));
  width: 100%;
  overflow: auto;
`;
