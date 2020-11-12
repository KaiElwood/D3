window.addEventListener("resize", function() {
    document.querySelector('svg').remove;
    createElements()
});


function createElements(){
    const svg = d3.select('svg')
        .attr('height', innerHeight)
        .attr('width', innerWidth);

    const height = +svg.attr('height');
    const width = +svg.attr('width');
    const eyeSpacing = 100;


    const circle = svg.append('circle')
        .attr('r', 200)
        .attr('cx', width/2)
        .attr('cy', height/2)
        .attr('fill', 'yellow')
        .attr('stroke', 'black');

    const leftEye = svg.append('circle')
        .attr('r', 20)
        .attr('cx', width/2 - eyeSpacing)
        .attr('cy', height/2 -70)
        .attr('fill', 'black')
        .attr('stroke', 'black');   
    const rightEye = svg.append('circle')
        .attr('r', 20)
        .attr('cx', width/2 + eyeSpacing)
        .attr('cy', height/2 - 70)
        .attr('fill', 'black')
        .attr('stroke', 'black');  

    const g = svg.append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);

    const nose = g.append('path')
        .attr('d', d3.arc()({
            innerRadius: 00,
            outerRadius: 30,
            startAngle: Math.PI/2,
            endAngle: Math.PI/10
        }))
    
    const smile = g.append('path')
        .attr('d', d3.arc()({
            innerRadius: 00,
            outerRadius: 130,
            startAngle: Math.PI/2,
            endAngle: Math.PI*3/2
        }))
        .attr('transform', `translate(0, 20)`);
}

createElements();