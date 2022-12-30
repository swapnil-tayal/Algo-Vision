import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra} from '../algorithms/dijkstra';
import {dfs} from '../algorithms/dfs';
import {bfs} from '../algorithms/bfs';
import {bidirectional} from '../algorithms/bidirectional';
import {getNodesInShortestPathOrder} from '../algorithms/NodesInShortestPath'
import './PathfindingVisualizer.css';
import arrow from './images/arrow.png';
import start from './images/start.png';
import finish from './images/finish.png';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
        algo: 'Dijkstra',
        matrix: 'Matrix',
        speed: 5,
        nodes: [],
        mouseIsPressed: false,
        START_NODE: [11, 15],
        FINISH_NODE: [11, 43],
        PREV_START: [11, 15],
        PREV_END: [11, 43],
        isMousePressed: false,
        startNodePressed: false,
        finishNodePressed: false,
        totalVisitedNodes: '',
        pathLenght: '',
        isVisualize: false,
        pathLength: '??',
        totalVisNodes: '',
        dropDownAlgo: 'algoNotVisible',
        dropDownMaze: 'mazeNotVisible',
        dropDownSpeed: 'speedNotVisible'
    };
    this.counter = null;
    this.onAlgoClick = this.onAlgoClick.bind(this);
    this.onMazeClick = this.onMazeClick.bind(this);
    this.onSpeedClick = this.onSpeedClick.bind(this);

    this.onChangeMaze = this.onChangeMaze.bind(this);

    this.changeAlgoToDij = this.changeAlgoToDij.bind(this);
    this.changeAlgoToBFS = this.changeAlgoToBFS.bind(this);
    this.changeAlgoToDFS = this.changeAlgoToDFS.bind(this);
    this.changeAlgoToBid = this.changeAlgoToBid.bind(this);
    
    this.changeSpeedToFast = this.changeSpeedToFast.bind(this);
    this.changeSpeedToSlow = this.changeSpeedToSlow.bind(this);
    this.changeSpeedToMean = this.changeSpeedToMean.bind(this);
  }

  componentDidMount() {
    const nodes = this.getInitialGrid();
    this.setState({nodes});
  }

  getInitialGrid(){
    const nodes = [];
    for (let row = 0; row < 23; row++) {
      const currentRow = [];
      for (let col = 0; col < 59; col++) {
        currentRow.push(this.createNode(col, row));
      }
      nodes.push(currentRow);
    }
    return nodes;
  };

  createNode(col, row){
    return {
      col,
      row,
      isStart: row === this.state.START_NODE[0] && col === this.state.START_NODE[1],
      isFinish: row === this.state.FINISH_NODE[0] && col === this.state.FINISH_NODE[1],
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  getNewGridWithWallToggled(grid, row, col){
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  handleMouseDown(row, col) {
    if(this.state.isVisualize) return;
    if(row === this.state.START_NODE[0] && col === this.state.START_NODE[1]){
      this.setState({startNodePressed: true, PREV_START: [row, col]});
    }else if(row === this.state.FINISH_NODE[0] && col === this.state.FINISH_NODE[1]){
        this.setState({finishNodePressed: true,PREV_END: [row, col]});
    }else{
      const newNodes = this.getNewGridWithWallToggled(this.state.nodes, row, col);
      this.setState({nodes: newNodes, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.startNodePressed){
      var previousStartNodeRow = this.state.PREV_START[0];
      var previousStartNodeCol = this.state.PREV_START[1];
      document.getElementById(`node-${previousStartNodeRow}-${previousStartNodeCol}`).className = 'node';
      document.getElementById(`node-${row}-${col}`).className = 'node node-start';
      this.setState({START_NODE: [row, col], PREV_START: [row, col]});

    }else if(this.state.finishNodePressed){
      var previousFinishNodeRow = this.state.PREV_END[0];
      var previousFinishNodeCol = this.state.PREV_END[1];
      document.getElementById(`node-${previousFinishNodeRow}-${previousFinishNodeCol}`).className = 'node node-removeImage';
      document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
      this.setState({FINISH_NODE: [row, col], PREV_END: [row, col]});

    }else{
      if (!this.state.mouseIsPressed) return;
      const newNode = this.getNewGridWithWallToggled(this.state.nodes, row, col);
      this.setState({nodes: newNode});
    }
  }

  handleMouseUp() {
    if (this.state.startNodePressed) {
      this.setState({mouseIsPressed: false, startNodePressed: false});
      this.handleClear();
    }else if(this.state.finishNodePressed) {
      this.setState({mouseIsPressed: false, finishNodePressed: false});
      this.handleClear();
    }else this.setState({mouseIsPressed: false});
  }

  handleClear = () => {
    this.setState({pathLength: '??'})

    for (let row = 0; row < 23; row++){
      for (let col = 0; col < 59; col++){

        var node = this.state.nodes[row][col];
        node.isVisited = false;
        node.distance = Infinity;
        node.previousNode = null;
        node.isConsidered = false;

        if(row === this.state.START_NODE[0] && col === this.state.START_NODE[1]){
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
        }else if(row === this.state.FINISH_NODE[0] && col === this.state.FINISH_NODE[1]){
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        }else if (node.isWall){
          node.isWall = false;
        }else{
          document.getElementById(`node-${row}-${col}`).className = 'node clearNode';
        }
      }
    }
  };

  handleClearWithoutWalls(){
    this.setState({pathLength:''});

    for (let row = 0; row < 23; row++) {
      for (let col = 0; col < 59; col++) {

        var node = this.state.nodes[row][col];
        node.isVisited = false;
        node.distance = Infinity;
        node.previousNode = null;
        node.isConsidered = false;

        if(row === this.state.START_NODE[0] &&col === this.state.START_NODE[1]){
          document.getElementById(`node-${row}-${col}`).className ='node node-start';
        }else if(row === this.state.FINISH_NODE[0] && col === this.state.FINISH_NODE[1]){
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        }else if (node.isWall){
          document.getElementById(`node-${row}-${col}`).className ="node node-wall" ;
        }else{
          document.getElementById(`node-${row}-${col}`).className = 'node clearNode';
        }
      }
    }
  };

  animate(visitedNodesInOrder, nodesInShortestPathOrder){

    for (let i = 1; i <= visitedNodesInOrder.length; i++){
      if(i === visitedNodesInOrder.length-1) continue;
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        // this.setVistedNode(i);
      },this.state.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length-1; i++) {
      setTimeout(() => {
        this.setPathLen(i);
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 50*i);
    }
  }

  setVistedNode(i){
    this.setState({totalVisNodes:i});
  }
  setPathLen(i){
    this.setState({pathLength: i});
  }

  visualize() {
    this.handleClearWithoutWalls();
    if(this.state.algo === ''){
      alert('Select Algorithm');
      return;
    }
    console.log(this.state.algo)
    const {nodes} = this.state;
    const startNode = nodes[this.state.START_NODE[0]][this.state.START_NODE[1]];
    const finishNode = nodes[this.state.FINISH_NODE[0]][this.state.FINISH_NODE[1]];
    var visitedNodesInOrder = [];

    if (this.state.algo === 'Dijkstra') {
      visitedNodesInOrder = dijkstra(this.state.nodes, startNode, finishNode);
    }
    else if(this.state.algo === 'DFS'){
      visitedNodesInOrder = dfs(this.state.nodes, startNode, finishNode);
    }
    else if(this.state.algo === 'BFS'){
      visitedNodesInOrder = bfs(this.state.nodes, startNode, finishNode);
    }
    else if(this.state.algo === 'Bidirectional'){
      visitedNodesInOrder = bidirectional(this.state.nodes, startNode, finishNode);
      const visitedNodesInOrderS = visitedNodesInOrder[0];
      const visitedNodesInOrderF = visitedNodesInOrder[1];  
      this.animateBID(visitedNodesInOrderS, visitedNodesInOrderF);
      return;
    }
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateBID(visitedNodesInOrderS, visitedNodesInOrderF){
    for (let i = 0; i < visitedNodesInOrderS.length; i++) {
      setTimeout(() => {
        const nodeS = visitedNodesInOrderS[i];
        document.getElementById(`node-${nodeS.row}-${nodeS.col}`).className = 'node node-visited';
      }, this.state.speed * i);
    }
    for (let i = 0; i < visitedNodesInOrderF.length; i++) {
      setTimeout(() => {
        const nodeF = visitedNodesInOrderF[i];
        document.getElementById(`node-${nodeF.row}-${nodeF.col}`).className = 'node node-visited';
      }, this.state.speed * i);
    }   
  }
  
  RandomWalls(){
    this.handleClear();
    this.setState({dropDownMaze: 'mazeNotVisible'});
    var i = 0;
    for(let row=0; row<23; row++){
      for(let timesInRow=0; timesInRow<10; timesInRow++){
        i = i + 1;
        setTimeout(() => {
          var randomCol = Math.floor(Math.random()*59);
          var node = this.state.nodes[row][randomCol]
          if(node.isStart == false && node.isFinish == false){
            node.isWall = true;
            document.getElementById(`node-${row}-${randomCol}`).className = "node node-wall";
          }
        }, 10*i);
      }
    }
  }

  AlternateMaze(){
    this.handleClear();
    this.setState({dropDownMaze: 'mazeNotVisible'});
    var i = 0;
    for(let row=0; row<23; row=row+2){
      for(let col=0; col<59; col=col+2){
        i = i + 1;
        setTimeout(() => {
          var node = this.state.nodes[row][col]
          if(node.isStart == false && node.isFinish == false){
              node.isWall = true;
              document.getElementById(`node-${row}-${col}`).className = "node node-wall";
          }
        }, 10*i);
      }
    }
  }

  Labyrinth(){
    this.handleClear();
    this.setState({dropDownMaze: 'mazeNotVisible'});
    var i = 0;
    for(let row=0; row<23; row++){
      i = i+1;
      setTimeout(() => {
        var node1 = this.state.nodes[row][0]
        var node2 = this.state.nodes[row][58]
        if(node1.isStart == false && node1.isFinish == false){
          node1.isWall = true;
          document.getElementById(`node-${row}-${0}`).className = "node node-wall";
        }
        if(node2.isStart == false && node2.isFinish == false){
          node2.isWall = true;
          document.getElementById(`node-${row}-${58}`).className = "node node-wall";
      }
      }, 25*i);
    }
    i=0
    for(let col=0; col<59; col++){
      i = i+1;
      setTimeout(() => {
        var node1 = this.state.nodes[0][col]
        var node2 = this.state.nodes[22][col]
        if(node1.isStart == false && node1.isFinish == false){
          node1.isWall = true;
          document.getElementById(`node-${0}-${col}`).className = "node node-wall";
        }
        if(node2.isStart == false && node2.isFinish == false){
          node2.isWall = true;
          document.getElementById(`node-${22}-${col}`).className = "node node-wall";
      }
      }, 25*i);
    }
    i = 0;
    for(let row=0; row<23; row=row+2){
      for(let col=0; col<59; col=col+Math.floor(Math.random()*3)){
        i = i + 1;
        setTimeout(() => {
          var node = this.state.nodes[row][col]
          if(node.isStart == false && node.isFinish == false){
            node.isWall = true;
            document.getElementById(`node-${row}-${col}`).className = "node node-wall";
          }
        }, 10*i);
      }
    }
    i=0;
    for(let row=0; row<23; row++){
      for(let timesInRow=0; timesInRow<12; timesInRow++){
        i = i + 1;
        setTimeout(() => {
          var randomCol = Math.floor(Math.random()*59);
          var node = this.state.nodes[row][randomCol]
          if(node.isStart == false && node.isFinish == false){
            node.isWall = true;
            document.getElementById(`node-${row}-${randomCol}`).className = "node node-wall";
          }
        }, 10*i);
      }
    }
  }

  onChangeMaze(event) {
    this.setState({matrix: event.target.value});
    event.preventDefault();
  }

  onAlgoClick() {
    this.setState({
      dropDownSpeed:'speedNotVisible',
      dropDownMaze:'mazeNotVisible',
    })
    if (this.state.dropDownAlgo == 'algoVisible') {
      this.setState({dropDownAlgo: 'algoNotVisible'});
    }else{
      this.setState({dropDownAlgo: 'algoVisible'});
    }
  }

  onMazeClick() {
    this.setState({
      dropDownAlgo:'algoNotVisible',
      dropDownSpeed:'speedNotVisible',
    })
    if (this.state.dropDownMaze == 'mazeVisible') {
      this.setState({dropDownMaze: 'mazeNotVisible'});
    }else{
      this.setState({dropDownMaze: 'mazeVisible'});
    }
  }

  onSpeedClick(){
    this.setState({
      dropDownAlgo:'algoNotVisible',
      dropDownMaze:'mazeNotVisible',
    })
    if (this.state.dropDownSpeed == 'speedVisible') {
      this.setState({dropDownSpeed: 'speedNotVisible'});
    }else{
      this.setState({dropDownSpeed: 'speedVisible'});
    }
  }

  changeAlgoToDij(){
    this.setState({
      algo:'Dijkstra',
      dropDownAlgo:'algoNotVisible'
    })
  }

  changeAlgoToBFS(){
    this.setState({
      algo:'BFS',
      dropDownAlgo:'algoNotVisible'
    })
  }

  changeAlgoToDFS(){
    this.setState({
      algo:'DFS',
      dropDownAlgo:'algoNotVisible'
    })
  }

  changeAlgoToBid(){
    this.setState({
      algo:'Bidirectional',
      dropDownAlgo:'algoNotVisible'
    })
  }

  changeSpeedToFast(){
    this.setState({
      speed:5,
      dropDownSpeed:'speedNotVisible'
    })
  }
  changeSpeedToSlow(){
    this.setState({
      speed:15, 
      dropDownSpeed:'speedNotVisible'
    })
  }
  changeSpeedToMean(){
    this.setState({
      speed:8,
      dropDownSpeed:'speedNotVisible'
    })
  }

  render() {
    const {nodes, mouseIsPressed} = this.state;

    return (
      <>
        <header id="header">
          <div>
            <a id="heading"  href="#">NIC-ALGO VISUALIZER</a>
          </div>
          <nav id="nav">
            <div value={this.state.algo} id="algo">
              <a className="head" href="#" onClick={() => this.onAlgoClick()}> Algorithm </a>
              <div className={this.state.dropDownAlgo}>
                <a href="#" onClick={() => this.changeAlgoToDij()} value="Dijkstra"> Dijkstra </a>
                <a href="#" onClick={() => this.changeAlgoToBFS()} value="BFS Algo"> BFS Algo </a>
                <a href="#" onClick={() => this.changeAlgoToDFS()} value="DFS Algo"> DFS Algo </a>
                <a href="#" onClick={() => this.changeAlgoToBid()} value="DFS Algo"> Bidirectional </a>
              </div>
            </div>
            <img style={{height: '15px'}} src={arrow} />

            <div value={this.state.algo} id="maze">
              <a className="head" href="#" onClick={() => this.onMazeClick()}> Maze </a>
              <div className={this.state.dropDownMaze}>
                <a href="#" onClick={() => this.AlternateMaze()}> Alternate </a>
                <a href="#" onClick={() => this.RandomWalls()}> Random </a>
                <a href="#" onClick={() => this.Labyrinth()}> Labyrinth </a>
                <a href="#" onClick={() => {this.AlternateMaze(); this.RandomWalls()}}> Random Connections </a>
              </div>
            </div>
            <img style={{height: '15px'}} src={arrow} />

            <div value={this.state.speed} id="speed">
              <a className="head" href="#" onClick={() => this.onSpeedClick()}> Speed </a>
              <div className={this.state.dropDownSpeed}>
                <a href="#" onClick={() => this.changeSpeedToFast()}> Fast </a>
                <a href="#" onClick={() => this.changeSpeedToSlow()}> Slow </a>
                <a href="#" onClick={() => this.changeSpeedToMean()}> Mean </a>
              </div>
            </div>
            <img style={{height: '15px'}} src={arrow} />

            <a className="head" href="#" onClick={() => this.visualize()}> Visualize {this.state.algo} </a>
            <a className="head" href="#" onClick={() => this.handleClear()}> Clear </a>
          </nav>
        </header>

        <div id="info">
          <div className="infodiv">
            <img  src={start} />
            <a>Start Node</a>
          </div>
          <div className="infodiv">
            <img  src={finish} />
            <a>Finish Node</a>
          </div>
          <div className="infodiv">
            <div className="myNode" ></div>
            <a>Unvisted Node</a>
          </div>
          <div className="infodiv">
            <div className="myNode-visited" ></div>
            <a>Visted Node</a>
          </div>
          <div className="infodiv">
            <div className="myNode-wall" ></div>
            <a>Wall</a>
          </div>
          <div className="infodiv">
            <div className="myNode-shortest" ></div>
            <a>Shortest Path</a>
          </div>
          <div className="infodiv">
            <a>Path length : {this.state.pathLength}</a>
            {/* <a className="head">Visted : {this.state.totalVisNodes}</a> */}
          </div>
        </div>

        <div className="grid">
          {nodes.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}>
                    </Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}