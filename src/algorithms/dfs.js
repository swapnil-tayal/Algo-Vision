export function dfs(grid, startNode, finishNode){

    const visNodes = [];
    const stack = [];
    if(startNode === finishNode){
        return visNodes;
    }
    stack.push(startNode)
    startNode.isVisited = true;
    while(stack.length !== 0){

        var node = stack.pop();
        node.isVisited = true;
        if(node.isWall === true) continue;
        if(node === finishNode){
            return visNodes;
        }
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
        for(const neighbor of unvisitedNeighbors){
            stack.push(neighbor)
            neighbor.previousNode = node;
        }
        visNodes.push(node);
    }
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