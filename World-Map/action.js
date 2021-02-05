const svg = d3.select('svg')
    .attr('height', innerHeight)
    .attr('width', innerWidth);

// we can use d3.geoMercator() to get a projection of a map... I think
const projection = d3.geoNaturalEarth1();
// then we can generate the path from the data by using geoPath().projection() – which is the method of geoPath – and then adding in
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append('g');

g.append("path")
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: "Sphere"}));

svg.call(d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform)
}));

// json function returns a promise, so we can use .then
d3.json("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
    .then(data => {
        // const div = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        // if we wanted to use the reduce function to create an object of country id's and names (such as for looking up countries by name), we could do this.
        // const inputData = data.objects.countries.geometries;
        // const countryName = inputData.reduce((accumulator, currentVal) => {
        //     accumulator[currentVal.id] = currentVal.properties.name;
        //     return accumulator;
        // }, {});

        const countries = topojson.feature(data, data.objects.countries);

        // for every element in countries array returned from the world atlas data, create a path element by putting the json data through the pathGenerator function, and returning the path string.
        g.selectAll('path').data(countries.features)
        .enter().append('path')
            // .attr('d', d => pathGenerator(d)) is equivalent to
            .attr("class", "country")
            .attr('d', pathGenerator)
        .append('title')
            .text(d => d.properties.name);
            // If we wanted to use the div tooltip, we would do as follows below:
            // .attr('class', 'tooltip')
            // .on("mouseover", (d,i) => {
            //     div.transition()
            //          .duration(50)
            //          .style("opacity", 1)
            //     div.html(i.properties.name)
            //          .style("left", (d.pageX + 10) + "px")
            //          .style("top", (d.pageY - 15) + "px");
            // })
            // .on("mouseout", (d,i) => {
            //     div.transition()
            //          .duration(50)
            //          .style("opacity", 0)
            // });

    })