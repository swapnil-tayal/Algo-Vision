export function bfs(grid, startNode, finishNode){

    const visNodes = [];
    const queue = [];
    if(startNode === finishNode){
        return visNodes;
    }
    queue.push(startNode)
    startNode.isVisited = true;
    while(queue.length !== 0){

        var node = queue.shift();
        node.isVisited = true;
        if(node.isWall === true) continue;
        if(node === finishNode){
            return visNodes;
        }
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
        for(const neighbor of unvisitedNeighbors){
            queue.push(neighbor)
            neighbor.isVisited = true;
            neighbor.previousNode = node;
        }
        visNodes.push(node);
    }
    return visNodes;
}

function getUnvisitedNeighbors(node, grid){
    const neighbor = [];
    const {row, col} = node;
    if(row < grid.length-1) neighbor.push(grid[row+1][col]);
    if(col < grid[0].length-1) neighbor.push(grid[row][col+1]);
    if(row > 0) neighbor.push(grid[row-1][col]);
    if(col > 0) neighbor.push(grid[row][col-1]);
    return neighbor.filter(neighbor => !neighbor.isVisited)
}