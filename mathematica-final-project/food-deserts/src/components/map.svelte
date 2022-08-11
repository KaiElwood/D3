<script>
    import * as d3Fetch from 'd3-fetch';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { scaleLinear } from 'd3-scale';
    import { geoAlbersUsa, geoPath } from 'd3-geo';
    import { color } from 'd3-color';
    import { interpolateLab } from 'd3-interpolate';
    import tippy from 'sveltejs-tippy'
    import ColorLegend from './color-legend.svelte';
    import { tooltip } from './tooltip';

    let figure
    let width = 800
    let height = 600
    export let data;
    let dataset  =  data;
    let selectedYear = '2013';
    export let filteredData;
    let filteredXAxis = filteredData.x;
    let filteredYAxis = filteredData.y;
    const projection = geoAlbersUsa();

    $: path = geoPath(projection
        .translate([width / 2, height / 2])
        .fitSize([width, height], dataset));

    let ordScale = (val, type) => {
      const index = type.indexOf(val);
      const scale = scaleLinear()
        .domain([0, type.length])
        .range([0, 1]);
      return scale(index);
    }

    // const getTooltip = (datapoint) => {
    //     if(datapoint.properties.data == null || datapoint.properties.data == undefined) {
    //         return `
    //         <div>${datapoint.properties.NAME} ${datapoint.properties.LSAD}</div>
    //         <p><span>Grocery Stores Per 1000 People:</span> Data Not Available</p>
    //         `
    //     } else {
    //         return `
    //         <div>${datapoint.properties.data[selectedYear]?.COUNTY}, ${datapoint.properties.data[selectedYear]?.STATE}</div>
    //         <p><span>Grocery Stores Per 1000 People:</span> ${datapoint.properties.data[selectedYear]?.groceryStores}</p>
    //         `
    //     }
    // }

    const setTooltips = () => {
        dataset.features.forEach(d => {
            let noDataTemplate = {content: `
                <div>${d.properties.NAME} ${d.properties.LSAD}</div>
                <p><span>Grocery Stores Per 1000 People:</span> Data Not Available</p>
                <p><span>Percent Population in Poverty:</span> Data Not Available</p>
                `,
                allowHTML: true,
                placement: 'top'
            };
            if(!d.properties.data){
                    d.properties.tooltips = {2013: noDataTemplate, 2014: noDataTemplate, 2015: noDataTemplate, 2016: noDataTemplate};
            } else {
                for(let x=2013; x<2017; x++){
                    (d.properties.tooltips ||= {})[x] = formatTooltip(d);
                }
            }
        })
    };

    let formatTooltip = (datapoint) => {
        let template;
        if(datapoint.properties.data == null || datapoint.properties.data == undefined) {
            template = `
            <div>${datapoint.properties.NAME} ${datapoint.properties.LSAD}</div>
            <p><span>Grocery Stores Per 1000 People:</span> Data Not Available</p>
            <p><span>Percent Population in Poverty:</span> Data Not Available</p>
            `
        } else {
            template = `
            <div>${datapoint.properties.data[selectedYear]?.COUNTY}, ${datapoint.properties.data[selectedYear]?.STATE}</div>
            <p><span>Grocery Stores Per 1000 People:</span> ${datapoint.properties.data[selectedYear]?.groceryStores}</p>
            <p><span>Percent of Population in Poverty:</span> ${datapoint.properties.data[selectedYear]?.poverty}</p>
            `
        }
        return {
        content: template,
        allowHTML: true,
        placement: 'top'
        }
    }
    
    const resize = () => {
        dataset = dataset;
        dataset.features.forEach(d => {console.log(d.properties.GEO_ID)})
        ;({ width } = figure.getBoundingClientRect())
    }

    let colorX = '#E6A2D0';
    let colorY = '#8AE1AE';
    let color0 = '#F3F3F3';
    let interpolator = interpolateLab;

    const bivariateColorScale = values => {
        const [xValue, yValue] = values;
        const xBotScale = interpolator(color0, colorX);
        const xTopScale = interpolator(
            colorY,
            multiplyColors(colorX, colorY)
        );

        const yColorScale = interpolator(
            xBotScale(ordScale(xValue, filteredXAxis)),
            xTopScale(ordScale(xValue, filteredXAxis))
        );
        return yColorScale(ordScale(yValue, filteredYAxis));
    }

    function multiplyColors(color1, color2) {
        const r = Math.round((color(color1)['r'] * color(color2)['r']) / 255);
        const g = Math.round((color(color1)['g'] * color(color2)['g']) / 255);
        const b = Math.round((color(color1)['b'] * color(color2)['b']) / 255);
        return rgbToHex(r, g, b);
    }

    function rgbToHex(r, g, b) {
        const componentToHex = c => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    const setColors = () => {
        let noDataColor = '#ccc';

        data.features.forEach(d => {
            if(!d.properties.data){
                d.properties.colors = {2013: noDataColor, 2014: noDataColor, 2015: noDataColor, 2016: noDataColor};
            } else {
                for(let x=2013; x<2017; x++){
                    if(d.properties.data[x] == undefined) {
                        (d.properties.colors ||= {})[x] = noDataColor;
                    } else {
                        (d.properties.colors ||= {})[x] = bivariateColorScale([d.properties.data[x].poverty, d.properties.data[x].groceryStores]);
                    }
                }
            }
        })
    }

    setColors();
    setTooltips();

    let automatedChange;
    let buttonContainer;
    let buttons;
    let curVal = 0;
    onMount(resize)

    const changeDate = (event) => {
        if (event) {
            let input = event.target;
            if(input.classList.contains('checked')){
                return
            } else {
                buttons.forEach(el => el.classList.remove('checked'));
                input.classList.add('checked')
                selectedYear = input.value;
            }
        } else {
            buttons.forEach(el => el.classList.remove('checked'));
            buttons[curVal].classList.add('checked');
            selectedYear = buttons[curVal].value;
            curVal = (curVal > 2) ? 0 : curVal+1;
        }
        dataset = dataset;
    }

    setTimeout(function() {
        buttonContainer = document.getElementById('yearButtons');
        buttons = [...buttonContainer.children];
        automatedChange = setInterval(changeDate, 1500);

        buttonContainer.addEventListener('click', function(event) {
            clearInterval(automatedChange);
            changeDate(event)
        })
    }, 4000)
            
</script>

<svelte:window on:resize="{resize}"/>
<figure class='fig' bind:this="{figure}">
    <div id='yearButtons'>
        <input type="button" value="2013" class='checked'>
        <input type="button" value="2014">
        <input type="button" value="2015">
        <input type="button" value="2016">
    </div>


<!-- I NEED: 
1. LEGEND

2. FIX TOOLTIPS, add tooltip for legend as well
3. ADD IN ADDITIONAL TEXT
can I make an array of all the formatted tooltip tippy values and then just update that based on what year is currently selected?

alternative option for tippy - create a new component, a mystery div that is added whenever you hover over a path element. the specific data for it is found... how?
 -->
 <!-- use:tippy={datapoint.properties.GEO_ID, {
    content: `<h1>${tippyCount}</h1>`,
    allowHTML: true,
    placement: 'top'
    }} -->

    <svg class="map" {width} {height}>
        {#if data}
            {#each dataset.features as datapoint (datapoint.properties.GEO_ID)}
                <path
                transition:fade
                
                use:tippy={datapoint.properties.tooltips[selectedYear]}
                
                d={path(datapoint)}
                fill={datapoint.properties.colors[selectedYear]}
                />
            {/each}
        {/if}
    </svg>
    <ColorLegend width={100} height={100} colorX={colorX} colorY={colorY} color0={color0} interpolator={interpolator} xTitle={'% in poverty'} yTitle={'Fewer Grocery Stores'}/>
</figure>