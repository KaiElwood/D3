const colorScale = d3.scaleOrdinal()
    .domain(["apple", "lemon"])
    .range(["#c11d1d", "#eae600"]);

const radiusScale = d3.scaleOrdinal()
    .domain(["apple", "lemon"])
    .range([50, 20]);

// const xPos = (d, i) => i * 150 + 100;

const translatePos = (d, i) => `translate(${i * 180 + 100},${innerHeight / 2})`;

// RENDERING LOGIC TEMPLATE
// references react components and structure – selection is element, props are properties
export const fruitbowl = (selection, props) => {
    const { fruits, onClick, selectedFruit } = props;

    let groups = selection.selectAll('g')
    .data(fruits, d => d.id);
    const groupsEnter = groups.enter().append('g');
    groupsEnter
        .attr('transform', translatePos)
        .merge(groups)
            .transition().duration(1000)
            .attr('transform', translatePos)
    groups.exit()
        .transition().duration(600)
    .remove();

    groups.exit()
        .select('circle')
        .transition().duration(800)
            .attr("r", 0)
    .remove();

    groups.exit()
        .select('text')
        .transition().duration(800)
        // .attr("fill", "white")
    .remove();

    let circles = groups.select('circle');
    groupsEnter.append("circle")
    .merge(circles)
        .on('click', d => onClick(d.path[0].__data__.id))
        .transition().duration(1000)
        .attr("fill", d => colorScale(d.type))
        .attr("r", d => radiusScale(d.type));
    
    groupsEnter.append("text")
        .merge(groups.select('text'))
            .text(d => d.type)
            .attr("fill", "black")
            .attr("y", 80);

    // // in order to return a unique ID, we can ask for it by returning the id for each data point in fruits
    // let circles = selection.selectAll('circle').data(fruits, d => d.id);
    // // how does this work?
    // // 1. selectAll sets up elements portion of d3 data join – looks for all existing circles – makes empty selection at time code is invoked
    // // 2. then .data provides the data which NEEDS TO BE AN ARRAY
    // // 3. we now have the total number of elements and total length of array
    // // 4. enter and append will work if there are no existing dom elements for the data
    // circles
    //     .enter().append('circle')
    //     // if we wanted to change height, we should add code below to merge section
    //         .attr("cx", xPos)
    //         .attr("cy", innerHeight / 2)
    //         // .attr("r", 0)
    //     .merge(circles)
    //     // .transition().duration(1000)
    //         .attr("cx", xPos)
    //         .attr("fill", d => colorScale(d.type))
    //         .attr("r", d => radiusScale(d.type));

    // // update case – THE DATA JOIN ITSELF IS THE UPDATE SELECTION
    // // You can also use merge to avoid duplicate code –– SEE ABOVE
    // // selection.selectAll('circle').data(fruits)
    // //     .attr("r", d => radiusScale(d.type))
    // //     .attr("fill", d => colorScale(d.type));

    // // exit case
    // circles.exit()
    // // .transition().duration(500)
    // //     .attr("r", 0)
    // .remove();

    // let text = selection.selectAll('text').data(fruits, d => d.id);
    // text
    //     .enter().append('text')
    //         .attr("x", xPos)
    //         .attr("y", innerHeight / 2 + 100)
    //     .merge(text)
    //         .attr("x", xPos)
    //         .text((d => d.type))
    // text.exit().remove();
}
