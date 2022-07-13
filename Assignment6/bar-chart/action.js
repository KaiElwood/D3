const filterValue = document.getElementById('filters');
const delayValue = document.getElementById('delay');
delayValue.addEventListener('change', () => {delayValue.value = delayValue.value});

const checkCurFilterVal = () => {
    console.log(filterValue.value)
    switch(filterValue.value) {
        case('S'):
            renderChart(cleanData.sort((a,b) => a.State.localeCompare(b.State)))
            break;
        case('EA'):
            renderChart(cleanData.sort((a,b) => a.Emissions - b.Emissions))
            break;
        case('ED'):
            renderChart(cleanData.sort((a,b) => b.Emissions - a.Emissions))
            break;
        default:
            break;
    };
};

// container dimensions
const height = 800;
const width = 1000;
const margins = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
const gHeight = height-margins.top-margins.bottom;

// calculate dimensions without margins
const innerHeight = height - margins.top - margins.bottom;
const innerWidth = width - margins.left - margins.right;

// create svg element
const svg = d3
  .select('#chart-container')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

// create inner group element
const g = svg
  .append('g')
  .attr('class', 'svg-group')
  .attr('transform', 'translate(' + width/4 + ',' + margins.top + ')');

let counter = 0;
let dataRange;
let cleanData;
let locationsSet;
let regionTotals;

// scale functions
//#region
let yScale;
let yScaleAxis;
let xScale;
let cScale;
const xAx = (g) =>g.call(d3.axisBottom(xScale).ticks()).call((g) => g.select(".domain").remove());
const yAx = (g) => g.call(d3
        .axisLeft(yScaleAxis)
        .tickValues([0, 160000, 320000, 480000, 640000, 750000])
    ).call((g) =>
        g.select(".domain")
        .attr("stroke", "#000")
        .attr("d", "M-5,150.5H0.5V-555.0H-6")
        .attr("stroke-width", "2")
        .attr("opacity", ".6")
    );
//#endregion

const setTextXLocation = (d) => {
    let x = xScale(d.Region) + barWidth/2;
    if(yScale(d.Emissions) < 15) {
        counter = !counter;
        let modifier = (counter) ? 1 : -1;
        x += barWidth*modifier;
        g.append('path').attr('class', 'pathLines').attr('stroke', 'black').attr('stroke-width', 1).attr('d', `M ${x - 9*modifier} ${gHeight - d.yPos} L ${x - barWidth/2*modifier} ${gHeight - d.yPos} Z`)
    };
    return x
};
const setTextColor = (d) => yScale(d) > 50 ? 'white' : 'black';
const barWidth = 40;

const renderChart = (datos) => {
    const transitions = [];
    // debugger;
    regionTotals = new Array([...locationsSet].length).fill(0);

    datos = datos.map((el) => {
        let index = [...locationsSet].indexOf(el.Region);
        el.yPos = regionTotals[index] + yScale(el.Emissions) / 2;
        regionTotals[index] += yScale(el.Emissions);
        el.location = `translate(${xScale(el.Region)}, ${gHeight - regionTotals[index]})`
        return el
    });

    g.selectAll(".regionElRect")
    .data(datos)
    .join(
        (enter) => enter
            .append("rect")
            .attr("transform", (d) => d.location)
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("class", "regionElRect")
            .attr("stroke", "black")
            .attr("fill", (d) => cScale(d.Emissions))
            .call(enter => transitions.push(
                enter.transition()
                  .duration((d,i) => 300 + i * delayValue.value)
                  .attr('height', (d) => yScale(d.Emissions))
                  .end()
              )),
        (update) => update
            .attr("transform", (d) => d.location)
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", (d) => cScale(d.Emissions))
            .call(update => transitions.push(
                update.transition()
                  .duration((d,i) => 300 + i * delayValue.value)
                  .attr('height', (d) => yScale(d.Emissions))
                  .end()
              )),
        (exit) => exit.remove()
    );

    g.selectAll(".regionElText")
    .data(datos)
    .join(
        (enter) => enter
            .append("text")
            .attr("y", (d) => gHeight - d.yPos)
            .attr("x", (d) => setTextXLocation(d))
            .attr("dy", ".25em")
            .attr('class', 'regionElText')
            .attr('fill', (d) => setTextColor(d.Emissions))
            .attr('text-anchor', 'middle')
            .style("font-size", 10)
            .style('opacity', 0)
            .style("font-family", "sans-serif")
            .text((d) => d.State)
            .call(enter => transitions.push(
                enter.transition()
                  .duration((d,i) => 300 + i * delayValue.value)
                  .style('opacity', "1")
                  .end()
              ))
            // .transition().duration((d,i) => 300 + i * delayValue.value).style("opacity", 1)
            ,
        (update) => {
            d3.selectAll('.pathLines').remove();
            update
            .attr("y", (d) => gHeight - d.yPos)
            .attr("x", (d) => setTextXLocation(d))
            .attr("dy", ".25em")
            .attr('class', 'regionElText')
            .attr('fill', (d) => setTextColor(d.Emissions))
            .attr('text-anchor', 'middle')
            .style("font-size", 10)
            .style('opacity', 0)
            .style("font-family", "sans-serif")
            .text((d) => d.State)
            .call(update => transitions.push(
                update.transition()
                  .duration((d,i) => 300 + i * delayValue.value)
                  .style('opacity', "1")
                  .end()
              ))
            return update
        },
        (exit) => exit.remove()
    );

    return Promise.all(transitions)
};

d3.csv('air_quality.txt').then(function(data) {
    data = data.map((d) => {
        d.Emissions = parseInt(d.Emissions.replace(/,/g,''));
        return d
    });
    // sort emissions data
    data = data.sort((a,b) => b.Emissions - a.Emissions);
    // set range data, set of all locations, and y pos array
    dataRange = d3.extent(data, (d) => d.Emissions);
    locationsSet = new Set(data.map((d) => d.Region));
    regionTotals = new Array([...locationsSet].length).fill(0);

    // add in scale functions
    yScale = d3.scaleLinear().domain(dataRange).nice().range([0, 150]);
    yScaleAxis = d3.scaleLinear().domain(dataRange).nice().range([150, 0]);
    xScale = d3.scalePoint().domain([...locationsSet]).range([25,350]);
    cScale = d3.scaleSequential().domain(dataRange).interpolator(d3.interpolatePuRd);
    //#region
    // ------------------ text variables ---------------
    const axisLabelSize = 16;
    const titleLabelSize = 24;
    const leftAxisTextLocation = [-100, yScale(450000)];
    const bottomAxisTextLocation = [130, gHeight + 40];
    const titleLocation = [40, -10];

    // ------------------ axis ----------------------
    g.append("g")
        .call(xAx)
        .attr("transform", `translate(${20},${gHeight + 0})`);
    
    g.append("g")
        .call(yAx)
        .attr("transform", `translate(-10,${gHeight - yScaleAxis(100)})`);
    
    // --------------------- text ---------------------
    g.append("text")
        .attr(
        "transform",
        `translate(${leftAxisTextLocation[0]}, ${leftAxisTextLocation[1]})`
        )
        .attr("dy", "0em")
        .style("font-size", axisLabelSize)
        .style("font-family", "sans-serif")
        .text("Emissions");
    
    g.append("text")
        .attr(
        "transform",
        `translate(${leftAxisTextLocation[0]}, ${leftAxisTextLocation[1]})`
        )
        .attr("dy", "1em")
        .style("font-size", axisLabelSize)
        .style("font-family", "sans-serif")
        .text("(Unit)");
    
    g.append("text")
        .attr(
        "transform",
        `translate(${bottomAxisTextLocation[0]}, ${bottomAxisTextLocation[1]})`
        )
        .attr("dy", "0em")
        .style("font-size", axisLabelSize)
        .style("font-family", "sans-serif")
        .text("US Regions");
    
    g.append("text")
        .attr("transform", `translate(${titleLocation[0]}, ${titleLocation[1]})`)
        .attr("dy", "0em")
        .style("font-size", titleLabelSize)
        .style("font-family", "sans-serif")
        .text("US Regional Emissions by State");
    
    // -------------------- legend ------------------------
    const colorLegendBlock = g
        .append("g")
        .attr("transform", `translate(500,${gHeight - 350})`);
    
    colorLegendBlock
        .append("text")
        .attr("y", -70)
        .attr("dy", "1em")
        .style("font-size", axisLabelSize)
        .style("font-family", "sans-serif")
        .text("Emissions, State Level");
    
    colorLegendBlock
        .append("g")
        .call(d3.axisLeft(yScaleAxis).ticks())
        .attr("transform", `translate(50,-40)`);
    
    const colorLegend = d3
        .scaleSequential()
        .domain([data.length, 0])
        .interpolator(d3.interpolatePuRd);
    
    colorLegendBlock
        .selectAll(".colorLegend")
        .data(data)
        .join(
        (enter) =>
            enter
            .append("rect")
            .attr("transform", `translate(50,-40)`)
            .attr("width", 20)
            .attr("height", 3)
            .attr("y", (d, i) => i * 3)
            .attr("fill", (d, i) => colorLegend(i)),
        (update) => update,
        (exit) => exit.remove()
        );
    //#endregion

    cleanData = data;
    renderChart(cleanData);
});

filterValue.addEventListener('change', () => {
    console.log('rerendering!')
    checkCurFilterVal()
})