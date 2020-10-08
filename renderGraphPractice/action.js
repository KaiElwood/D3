const data = [{ name: 'Alice', math: 93, science: 84 },
    { name: 'Bobby', math: 81, science: 97 },
    { name: 'Carol', math: 74, science: 88 },
    { name: 'David', math: 64, science: 76 },
    { name: 'Emily', math: 80, science: 94 }];

// function render(subject){
//     d3.select("#chart")
//         .selectAll("div")
//         .remove()
//     d3.select("#chart")
//         .selectAll('div')
//         .data(data)
//         .enter()
//         .append('div')
//         .attr("class", "bar")
//         .style("width", (d) => {
//             return d[subject] + "px";
//         })
// }

// now, let's reuse our existing data so we dont need to clear the entire screen every time we want to do something new

function render(subject){
    const bars = d3.select("#chart")
        .selectAll("div")
        .data(data, function(d){
            return d.name
        })
    
    const newBars = bars.enter()
        .append("div")
        .attr("class", "bar")
        .style("width", 0)
    
    newBars.merge(bars)
        .transition()
        .style("width", (d) => {
            return d[subject] + "px";
        });
};

render('math') ;