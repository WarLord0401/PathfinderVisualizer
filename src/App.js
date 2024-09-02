import React, {useRef, useState} from 'react';
import './App.css';
import PathfindingVisualizer from './Pathfinding Visualizer/PathfindingVisualizer';

function App() {
  const pathfindingVisualizerRef = useRef();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const handleStartNode = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateStartNode();
    }
  };

  const handleFinishNode = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateFinishNode();
    }
  };

  const handleWall = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateWall();
    }
  };

  const handleVisualize = () => {
    if (!selectedAlgorithm) {
      alert('Please select an algorithm before visualizing.');
      return;
    }
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.visualizeAlgorithm();
    }
  };

  const handleReset = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.resetGrid();
    }
  };

  const handleAlgorithmChange = algorithm => {
    setSelectedAlgorithm(algorithm);
    if (pathfindingVisualizerRef.current) {
      // Ensure setAlgorithm exists
      if (typeof pathfindingVisualizerRef.current.setAlgorithm === 'function') {
        pathfindingVisualizerRef.current.setAlgorithm(algorithm);
      } else {
        console.error('setAlgorithm is not a function');
      }
    }
  };

  return (
    <>
      <header className="title">Pathfinding Algorithm Visualization</header>
      <div className="main">
        <section className="grid-wrapper">
          <div className="grid-container">
            <PathfindingVisualizer
              ref={pathfindingVisualizerRef}
              selectedAlgorithm={selectedAlgorithm}
            />
          </div>
        </section>
        <section className="right">
          <div className="controls">
            <button
              type="button"
              className="control-btn start"
              onClick={handleStartNode}>
              Start Node
            </button>
            <button
              type="button"
              className="control-btn finish"
              onClick={handleFinishNode}>
              Finish Node
            </button>
            <button
              type="button"
              className="control-btn wall"
              onClick={handleWall}>
              Build Wall
            </button>
            <button
              type="button"
              className={`control-btn visualize ${
                selectedAlgorithm ? 'selected' : ''
              }`}
              onClick={handleVisualize}>
              VISUALIZE
            </button>
            <button
              type="button"
              className="control-btn reset"
              onClick={handleReset}>
              Reset
            </button>
          </div>
          <div className="pathfinding-methods">
            <h3>Pathfinding Methods</h3>
            <button
              className={selectedAlgorithm === 'dijkstra' ? 'selected' : ''}
              onClick={() => handleAlgorithmChange('dijkstra')}>
              Dijkstra's Algorithm
            </button>
            <button
              className={selectedAlgorithm === 'aStar' ? 'selected' : ''}
              onClick={() => handleAlgorithmChange('aStar')}>
              A* Algorithm
            </button>
          </div>
        </section>
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Kanishk Teotia | All rights reserved |
        Version 1.0
      </footer>
    </>
  );
}

export default App;
