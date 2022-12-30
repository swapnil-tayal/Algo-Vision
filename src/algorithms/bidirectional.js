export function bidirectional(grid, startNode, finishNode){

    const visNodesStart = [];
    const visNodesFinish = [];
    const queueStart = [];
    const queueFinish = [];
    const visRowColStart = [];
    const visRowColFinish = [];
    if(startNode === finishNode) return;

    queueStart.push(startNode);
    queueFinish.push(finishNode);

    while(queueFinish.length !== 0){

        var nodeS = queueStart.shift();
        var nodeE = queueFinish.shift();
        visRowColStart.push(nodeS.row + nodeS.col);
        visRowColFinish.push(nodeE.row + nodeE.col);

        if(visRowColFinish.includes(nodeS.row + nodeS.col) || 
            visRowColStart.includes(nodeE.row + nodeE.col)){
            return [visNodesStart, visNodesFinish];
        }
        if(!nodeS.isWall){
            const unvisitedNeighbors = getUnvisitedNeighbors(nodeS, grid);
            for(const neighbor of unvisitedNeighbors){
                queueStart.push(neighbor)
                neighbor.isConsidered = true;
                neighbor.previousNode = nodeS;
            }
            visNodesStart.push(nodeS);
        }
        if(!nodeE.isWall){
            const unvisitedNeighbors = getUnvisitedNeighbors(nodeE, grid);
            for(const neighbor of unvisitedNeighbors){
                queueFinish.push(neighbor)
                neighbor.isConsidered = true;
                neighbor.previousNode = nodeE;
            }
            visNodesFinish.push(nodeE);
        }
    }
    return [visNodesStart, visNodesFinish];
}

function getUnvisitedNeighbors(node, grid){
    const neighbor = [];
    const {row, col} = node;
    if(row < grid.length-1) neighbor.push(grid[row+1][col]);
    if(col < grid[0].length-1) neighbor.push(grid[row][col+1]);
    if(row > 0) neighbor.push(grid[row-1][col]);
    if(col > 0) neighbor.push(grid[row][col-1]);
    return neighbor.filter(neighbor => !neighbor.isVisited && !neighbor.isConsidered)
}