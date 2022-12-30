import logo from './logo.svg';
import './App.css';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer.jsx'
import Intro from './PathfindingVisualizer/intro/intro';

function App() {
  return (
    <div className="App">
      <Intro/>
      <PathfindingVisualizer/>
    </div>
  );
}

export default App;
