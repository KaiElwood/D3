function createChart(elementId) {

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
      .select(elementId)
      .append('svg')
      .attr('height', height)
      .attr('width', width);
  
    // create inner group element
    const g = svg
      .append('g')
      .attr('class', 'svg-group')
      .attr('transform', 'translate(' + width/4 + ',' + margins.top + ')');
  


    const processData = (data) => {
        let processedD = data.reduce((acc, obj) => {
            let key = obj.Region;
            acc[key] ||= [];
            acc[key].push({'State' : obj.State, 'Emissions' : obj.Emissions})
            return acc
          }, {})
        return Object.keys(processedD).map((el) => processedD[el].sort((a,b) => b.Emissions - a.Emissions))
    }
    
    // read in air quality data
    d3.csv('air_quality.txt').then(function(data) {
        console.log(data);
        data = data.map((d) => {
            d.Emissions = parseInt(d.Emissions.replace(/,/g,''));
            return d
        });
        data = data.sort((a,b) => b.Emissions - a.Emissions);
        let dataRange = d3.extent(data, (d) => d.Emissions);
        debugger
        let locationsSet = new Set(data.map((d) => d.Region));
        let regionTotals = new Array([...locationsSet].length).fill(0);

        const yScale = d3.scaleLinear().domain(dataRange).nice().range([0, 150]);
        const yScaleAxis = d3.scaleLinear().domain(dataRange).nice().range([150, 0]);
        const xScale = d3.scalePoint().domain([...locationsSet]).range([25,300]);
        const cScale = d3.scaleSequential().domain(dataRange).interpolator(d3.interpolatePuRd);
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
        data = data.map((el,i) => {
            let index = [...locationsSet].indexOf(el.Region);
            el.yPos = regionTotals[index] + yScale(el.Emissions) / 2;
            regionTotals[index] += yScale(el.Emissions);
            el.location = `translate(${xScale(el.Region)}, ${gHeight - regionTotals[index]})`
            return el
        })
        console.log(data)
        let cleanedData = processData(data);
        console.log(cleanedData);
        
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
            .attr("transform", `translate(400,${gHeight - 350})`);
        
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

        let counter = 0;
        const setTextXLocation = (d) => {
            let x = xScale(d.Region) + barWidth/2;
            if(yScale(d.Emissions) < 15) {
                counter = !counter;
                console.log(counter);
                let modifier = (counter) ? 1 : -1;
                x += barWidth*modifier
                console.log(`M ${x} ${yScale(d.Emissions)} L ${x-5} ${yScale(d.Emissions)} Z`)
                g.append('path').attr('stroke', 'black').attr('stroke-width', 1).attr('d', `M ${x - 9*modifier} ${gHeight - d.yPos} L ${x - barWidth/2*modifier} ${gHeight - d.yPos} Z`)
            }
            return x
        }
        const barWidth = 40;
        g.selectAll(".regionEl")
            .data(data)
            .join(
            (enter) => {
                let group = enter;
                group
                .append("rect")
                .attr("transform", (d, i) => d.location)
                .attr("width", barWidth)
                .attr("height", (d) => yScale(d.Emissions))
                .attr("class", ".regionEl")
                .attr("stroke", "black")
                .attr("fill", (d) => cScale(d.Emissions));
                // statesByRegion[
                group
                .append("text")
                .attr("y", (d) => gHeight - d.yPos)
                .attr("x", (d) => setTextXLocation(d))
                .attr("dy", ".25em")
                .attr('text-anchor', 'middle')
                .style("font-size", 10)
                .style("font-family", "sans-serif")
                .text((d) => d.State);
                return g;
            },
            (update) => update,
            (exit) => exit.remove()
            );
    });
};

createChart('#chart-container');