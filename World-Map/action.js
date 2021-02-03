const svg = d3.select('svg')
    .attr('height', innerHeight)
    .attr('width', innerWidth);

// const height = +svg.attr('height');
// const width = +svg.attr('width');

// we can use d3.geoMercator() to get a projection of a map... I think
const projection = d3.geoNaturalEarth1();
// then we can generate the path from the data by using geoPath().projection() – which is the method of geoPath – and then adding in
const pathGenerator = d3.geoPath().projection(projection);

svg.append("path")
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: "Sphere"}))

// json function returns a promise, so we can use .then
d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
    .then(data => {
        // const div = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        const countries = topojson.feature(data, data.objects.countries);
        console.log(data);
        // for every element in countries array returned from the world atlas data, create a path element by putting the json data through the pathGenerator function, and returning the path string.
        svg.selectAll('path').data(countries.features)
        .enter().append('path')
            // .attr('d', d => pathGenerator(d)) is equivalent to
            .attr("class", "country")
            .attr('d', pathGenerator)
        .append('title')
            // .attr('class', 'tooltip')
            .text((d) => d.properties.name);
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