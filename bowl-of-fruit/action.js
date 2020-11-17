function createElements(){
    const svg = d3.select('svg')
        .attr('height', innerHeight)
        .attr('width', innerWidth);

    const colorScale = d3.scaleOrdinal()
        .domain(["apple", "lemon"])
        .range(["#c11d1d", "#eae600"])

    const radiusScale = d3.scaleOrdinal()
        .domain(["apple", "lemon"])
        .range([50, 20])
        
    // RENDERING LOGIC TEMPLATE
    // references react components and structure – selection is element, props are properties
    const render = (selection, { fruits }) => {

        // how does this work?
        // 1. selectAll sets up elements portion of d3 data join – looks for all existing circles – makes empty selection at time code is invoked
        // 2. then .data provides the data which NEEDS TO BE AN ARRAY
        // 3. we now have the total number of elements and total length of array
        // 4. enter and append will work if there are no existing dom elements for the data
        selection.selectAll('circle').data(fruits)
            .enter().append('circle')
            // if we wanted to change height, we should add code below to merge section
            .attr("cx", (d, i) => i * 150 + 100)
            .attr("cy", innerHeight / 2)
        .merge(selection.selectAll('circle').data(fruits))
            .attr("r", d => radiusScale(d.type))
            .attr("fill", d => colorScale(d.type));
        
        // update case – THE DATA JOIN ITSELF IS THE UPDATE SELECTION
        // You can also use merge to avoid duplicate code –– SEE ABOVE
        // selection.selectAll('circle').data(fruits)
        //     .attr("r", d => radiusScale(d.type))
        //     .attr("fill", d => colorScale(d.type));
            
        // exit case
        selection.selectAll('circle').data(fruits)
            .exit().remove();
    }
    
    const makeFruit = type => ({type});

    const fruits = d3.range(5)
        .map(() => makeFruit('apple'));

    render(svg, { fruits });

    // eating an apple
    setTimeout(() => {
        fruits.pop();
        render(svg, { fruits });
    }, 1000);

    // replacing with lemon
    // this will not work unless we use update pattern!!!
    setTimeout(() => {
        fruits[2].type = "lemon";
        render(svg, { fruits });
    }, 3000);

}

createElements();