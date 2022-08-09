<script>
    import * as d3Fetch from 'd3-fetch';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { scaleOrdinal, scaleLinear } from 'd3-scale';
    import { geoAlbersUsa, geoPath } from 'd3-geo';
    import { color } from 'd3-color';
    import { interpolateLab } from 'd3-interpolate';
    import tippy from 'sveltejs-tippy'
    import ColorLegend from './color-legend.svelte';

    let figure
    let width = 800
    let height = 600

    export let data;
    let dataset  =  data;
    let selectedYear = '2013';

    export let filteredData;
    console.log(data)

    let filteredXAxis = filteredData.x;
    let filteredYAxis = filteredData.y;

    console.log(filteredXAxis)


    const projection = geoAlbersUsa();
    $: path = geoPath(projection
        .translate([width / 2, height / 2]));
        // .fitSize([width, height], dataset));

    // let colorScale = scaleLinear()
    //   .domain([0,.15,3])
    //   .range(['#FF4B4B', "#fd8d3c", "#feedde"])
    //   .clamp(true);


    //   domain could come from the extent minus some outliers

    let ordScale = (val, type) => {
        // what is filteredYData?
      const index = type.indexOf(val);
      const scale = scaleLinear()
        .domain([0, type.length])
        .range([0, 1]);
      return scale(index);
    }

    let formatTooltip = (data) => {
        // this is being formatted before any data is updated. I need to re-update every tooltip when new data is brought in
        // debugger;
        let template = '';
        if(data.properties.selectedData == null) {
            template = `
            <div>${data.properties.NAME} ${data.properties.LSAD}</div>
            <p><span>Grocery Stores Per 1000 People:</span> Data Not Available</p>
            `
        } else {
            template = `
            <div>${data.properties?.selectedData[0]?.COUNTY}, ${data.properties?.selectedData[0]?.STATE}</div>
            <p><span>Grocery Stores Per 1000 People:</span> ${data.properties?.selectedData[0]?.groceryStores}</p>
            `
        }

        return {
        content: template,
        allowHTML: true,
        placement: 'top',
        }
    }
    
    // best option
    const resize = () => {
        dataset = dataset;
        ;({ width } = figure.getBoundingClientRect())
    }

    let scaleWidth = 75;
    let scaleHeight = 75;
    let colorX = '#E6A2D0';
    let colorY = '#8AE1AE';
    let color0 = '#F3F3F3';
    let interpolator = interpolateLab;

    const setColors = (value) => {
        if (!value.properties.data){
            value.properties.color = "#ccc";
            return
        }
        let selectedYearArray = value.properties.data.filter(d => d.YEAR == selectedYear);
        value.properties.selectedData = selectedYearArray;
        if(selectedYearArray.length < 1) {
            value.properties.color = '#ccc';
            return
        } else {
            value.properties.color = bivariateColorScale([selectedYearArray[0].poverty, selectedYearArray[0].groceryStores]);
            return;
        }
    }

    const setData = () => {
        dataset.features.forEach((value) => {
            // console.log('initial color value', value.properties?.color);
            setColors(value);
            // formatTooltip(value);
        })
    };

    const bivariateColorScale = values => {
        const [xValue, yValue] = values;

        // here, the x value is poverty, and the y value is grocery stores per 1000. more intense on the x axis would be fewer grocery stores. more intense color on the y axis would be higer percentage of people at or below 1 poverty/income ratio

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

    let automatedChange;
    let buttonContainer;
    let buttons;
    let curVal = 0;
    onMount(resize)
    onMount(setData)

    const changeDate = (event) => {
        if (event) {
            let input = event.target;
            if(input.classList.contains('checked')){
                return
            } else {
                buttons.forEach(el => el.classList.remove('checked'));
                input.classList.add('checked')
                selectedYear = input.value;
                setData();
            }
        } else {
            buttons.forEach(el => el.classList.remove('checked'));
            buttons[curVal].classList.add('checked');
            selectedYear = buttons[curVal].value;
            curVal = (curVal > 2) ? 0 : curVal+1;
            setData();
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
 -->


    <svg class="map" {width} {height}>
        {#if data}
        <!-- what should I include as my key? -->
        <!-- potentially two keys - one for date cahnge, one -->
            {#each dataset.features as datapoint (datapoint.properties.GEO_ID)}
                <path
                transition:fade
                on:mouseenter='{formatTooltip(datapoint)}'
                use:tippy="{formatTooltip(datapoint)}"
                d={path(datapoint)}
                fill={datapoint.properties.color}
                />
            {/each}
        {/if}
    </svg>
    <ColorLegend width={100} height={100} colorX={colorX} colorY={colorY} color0={color0} interpolator={interpolator} xTitle={'% of pop in poverty'} yTitle={'Grocery stores per 1000 pop'}/>
</figure>