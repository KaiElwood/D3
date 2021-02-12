const svg = d3.select('svg');

const width = document.body.clientWidth;
const height = 900;

// Margin convention hack to edit the appearance of the graph
const margin = {top:0,bottom:0,left:75,right:50};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const treeLayout = d3.tree()
    .size([innerHeight,innerWidth])

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g');

const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.call(d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform)
}))
    
d3.json('data.json')
    .then(data => {
        // the root of the tree
        const root = d3.hierarchy(data);
        // the "links" or connections between the data points
        const links = treeLayout(root).links();
        // creates a linked tree
        const linkPathGen = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);
        g.selectAll('path').data(links)
            .enter().append('path')
                .attr('d', linkPathGen);

        // root.descendants() gives you the flattened tree
        g.selectAll('text').data(root.descendants())
            .enter().append('text')
                .attr('x', d => d.y)
                .attr('y', d=> d.x)
                .attr('dy', '.32em')
                .attr('text-anchor', d => d.children ? "middle" : 'start')
                .attr('font-size', d => 3.25 - d.depth + 'em')
                .attr('class', 'glow')
                .text(d => d.data.data.id)
    })