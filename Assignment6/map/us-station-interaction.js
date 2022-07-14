const selectElement = document.getElementById('select');
let selectedClasses = Array.from(selectElement.children).filter((d) => d.firstChild.localName=='input').map((d) => d.firstChild.checked='true');

const min = document.getElementById('min');
const max = document.getElementById('max');
document.getElementById('filterButton').addEventListener('click', () => filterCircles())

const filterCircles = () => {
    let val1 = min.value ? min.value: -50;
    let val2 = max.value ? max.value : 5000;
    let params = stationsData.filter((d) => selectedClasses[d.stationClass-1])
    .filter(d => (d.elevation >= val1 && d.elevation <= val2));
    makeCircles(params, 1);
}

const height = 500;
const width = 900;
const margins = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};

const innerHeight = height;
const innerWidth = width;

const svg = d3
  .select('#chart-container')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

const g = svg
  .append('g')
  .attr('class', 'svg-group');

d3.json('us-states.json').then(function(geoJSONStates) {  
    g.selectAll("path")
        .data(geoJSONStates.features)
        .join(
            (enter) => enter.append("path").attr("d", path),
            (update) => update,
            (exit) => exit.remove()
    );

    d3.csv('NSRDB_StationsMeta.txt').then(function(stations) {
        stationsData = stations.map((d,i) => {
            return {
                stationClass: +d.CLASS,
                ID: i,
                abb: d.ST,
                elevation: +d['NSRDB_ELEV (m)'],
                loc: [+d.longitude, +d.latitude]
              };
        }).filter(d => (projection(d.loc)));
        linearScale = d3.scaleLinear().domain(d3.extent(stationsData, d => d.elevation)).range([2, 12]);
        colorScale = d3.scaleOrdinal().domain([...new Set(stationsData.map((d) => d.stationClass))]).range(d3.schemeTableau10);
        Array.from(selectElement.children).forEach((child,i) => {
            child.firstChild.style.backgroundColor = colorScale(i+1);
        })
        makeCircles(stationsData, 0);
    });
});

let linearScale, colorScale, stationsData;
let projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);
const path = d3.geoPath(projection);

const makeCircles = (inputData, type) => {
    switch(type) {
        case 0: 
        g.selectAll("circle")
            .data(inputData, d => d.ID)
            .join(
            (enter) =>
                enter
                .append("circle")
                .attr("cx", (d) => projection(d.loc)[0])
                .attr("cy", (d) => projection(d.loc)[1])
                .attr("fill", (d) => colorScale(d.stationClass))
                .attr("r", 0).transition()
                    .duration((d,i) => 300 + i * 1)
                    .attr('r', d => linearScale(d.elevation)),
            (update) => update,
            (exit) => exit
                .transition().duration((d,i) => 300 + i * 1).attr('r', 0).remove()
            );
            break;
        case 1:
            g.selectAll("circle")
            .data(inputData, d => d.ID)
            .join(
            (enter) =>
                enter
                .append("circle")
                .attr("cx", (d) => projection(d.loc)[0])
                .attr("cy", -500)
                .attr("fill", (d) => colorScale(d.stationClass))
                .attr("r", d => linearScale(d.elevation)).transition()
                    .duration((d,i) => 600 + i * 5)
                    .attr('cy', d => projection(d.loc)[1]),
            (update) => update,
            (exit) => exit
                .transition().duration((d,i) => 600 + i * 5).attr('cy', 1000).remove()
            );
            break;
        default:
            break
    }
}

Array.from(selectElement.children).filter((d) => d.firstChild.localName=='input').forEach((el) => {
    el.addEventListener('change', () => {
        selectedClasses = Array.from(selectElement.children).filter((d) => d.firstChild.localName=='input').map((d) => d.firstChild.checked);

        el.firstChild.style.backgroundColor = el.firstChild.checked ? colorScale(el.firstChild.value) : `${el.firstChild.style.backgroundColor.slice(0,-1)},.3)`;

        makeCircles(stationsData.filter((d) => selectedClasses[d.stationClass-1]), 0);
    })
})