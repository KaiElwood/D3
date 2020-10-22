const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
    // select all rectangles, and then pass in the data array returned
    svg.selectAll('rect'),data(data);
};

d3.csv("popData.csv").then(data => {
    data.forEach(d =>{
        d.Population = +d.Population * 1000;
    })
    console.log(data);
})
