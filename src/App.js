import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import './App.css';
import PathfindingVisualizer from './Pathfinding Visualizer/PathfindingVisualizer';
import {GlobalTheme} from './Theme';
import {DarkModeIcon, LightModeIcon} from './ThemeIcon';
import {useDarkMode} from './useDarkMode';

function App() {
  const {isDarkMode, toggleTheme} = useDarkMode();
  const pathfindingVisualizerRef = useRef();
  const gridWrapperRef = useRef();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [gridDimensions, setGridDimensions] = useState({
    rows: 20,
    cols: calculateColumns(),
  }); // Default dimensions

  useEffect(() => {
    const handleResize = () => {
      setGridDimensions(prevDimensions => ({
        ...prevDimensions,
        cols: calculateColumns(),
      }));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set dimensions
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function calculateColumns() {
    const wrapperWidth = gridWrapperRef.current
      ? gridWrapperRef.current.clientWidth
      : 0;
    const columnWidth = 30; // Width of each column
    const columns = Math.floor(wrapperWidth / columnWidth);
    return Math.max(10, Math.min(columns, 50)); // Ensure columns are between 10 and 50
  }

  const handleStartNode = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateStartNode(); // Activates start node selection
    }
  };

  const handleFinishNode = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateFinishNode(); // Activates finish node selection
    }
  };

  const handleWall = () => {
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.activateWall(); // Activates wall toggle
    }
  };

  const handleVisualize = () => {
    if (!selectedAlgorithm) {
      alert('Please select an algorithm before visualizing.');
      return;
    }
    setIsVisualizing(true);
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.visualizeAlgorithm(() => {
        setIsVisualizing(false); // Callback to set visualization state
      });
    }
  };

  const handleStop = () => {
    setIsVisualizing(false);
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.stopVisualization(); // Stops visualization
    }
  };

  const handleReset = () => {
    setIsVisualizing(false);
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.resetGrid(); // Resets the grid
    }
  };

  const handleAlgorithmChange = algorithm => {
    setSelectedAlgorithm(algorithm);
    if (pathfindingVisualizerRef.current) {
      pathfindingVisualizerRef.current.setAlgorithm(algorithm); // Sets the algorithm
    }
  };

  return (
    <GlobalTheme isDarkMode={isDarkMode}>
      <header className="title">
        Pathfinding Algorithm Visualization
        <IconsContainer>
          <ThemeIconWrapper onClick={toggleTheme}>
            {isDarkMode ? (
              <LightModeIcon toggleDarkMode={toggleTheme} />
            ) : (
              <DarkModeIcon toggleLightMode={toggleTheme} />
            )}
          </ThemeIconWrapper>
        </IconsContainer>
      </header>
      <div className="main">
        <GridWrapper ref={gridWrapperRef}>
          <GridContainer cols={gridDimensions.cols}>
            <PathfindingVisualizer
              ref={pathfindingVisualizerRef}
              rows={gridDimensions.rows}
              cols={gridDimensions.cols}
              selectedAlgorithm={selectedAlgorithm}
              isVisualizing={isVisualizing}
            />
          </GridContainer>
        </GridWrapper>
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
              onClick={handleVisualize}
              disabled={isVisualizing}>
              VISUALIZE
            </button>
            <button
              type="button"
              className="control-btn stop"
              onClick={handleStop}
              disabled={!isVisualizing}>
              Stop
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
      <Footer>
        &copy; {new Date().getFullYear()} Kanishk Teotia | All rights reserved |
        Version 1.0
      </Footer>
    </GlobalTheme>
  );
}

export default App;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ThemeIconWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const GridContainer = styled.div`
  background-color: ${({theme}) => theme.mainColors.grey};
  border: 2px solid #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
  overflow: hidden;
  max-height: 70vh;
  display: flex;
  flex-direction:row;
  justify-content: center;
`;

const GridWrapper = styled.div`
  background-color: var(--grid-bg);
  padding: 20px;
  overflow: hidden;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: calc(100vw - 300px);
  max-height: 76vh;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Footer = styled.div`
  background-color: var(--footer-bg);
  color: var(--footer-text);
  text-align: center;
  padding: 15px;
  font-size: 1em;
  position: relative;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.9);
`;
