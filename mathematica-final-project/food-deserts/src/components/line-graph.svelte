<script>
    import { onMount } from 'svelte'
    import { draw, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { scaleLinear } from 'd3-scale';
    import { line, curveNatural } from 'd3-shape';
    import { extent } from "d3-array";
    import Axis from "./Axis.svelte";
    import tippy from 'sveltejs-tippy'

    export let data
    export let titles

    let figure
    let width = 800
    let height = 400

    let mainTitle = titles[2];
    let yAxisTitle = titles[0];
    let xAxisTitle = titles[1];

    const padding = { top: 35, right: 65, bottom: 35, left: 65 }

    let xMinMax = extent(data, (d)  =>  d.year);
    let yMinMax = extent(data, (d)  =>  d.data);

    let innerHeight = height - padding.bottom - padding.top;
    let yExtension = 1;

    $: xScale = scaleLinear()
    .domain(xMinMax)
    .range([0+padding.left, width-padding.right]);

    $: yScale = scaleLinear()
        .domain([yMinMax[0]-yExtension, yMinMax[1]+yExtension])
        .range([innerHeight, padding.top])

    $: line_gen  =  line()
    .curve(curveNatural)
    .x((d)  =>  xScale(d.year))
    .y((d)  =>  yScale(d.data))(data);

    const formatTooltip = (data) => {
      console.log(data)
        const template = `
        <div>${data.year}</div>
        <p><span>Percent of counties with fewer than 0.1 grocery stores per 1,000 residents:</span> ${data.data}</p>
        `

        return {
        content: template,
        allowHTML: true,
        placement: 'top',
        }
    }

    const resize = () => {
        ;({ width } = figure.getBoundingClientRect())
    }

    onMount(resize)
</script>

<svelte:window on:resize="{resize}" />
<figure class='fig' bind:this="{figure}">
  <!-- svelte-ignore component-name-lowercase -->
  <svg class="linechart" {width} {height}>

    <text class="mainTitle title" x="{width/2}" y="{padding.top}">{mainTitle}</text>

    <!-- y axis -->
    <text class="yAxisTitle title" x="{0}" y="{padding.left-padding.right}" style='transform: translate({padding.left/3}px, {innerHeight/2}px) rotate(-90deg);'>{yAxisTitle}</text>
    <Axis {innerHeight} {padding} scale={yScale} position="left" />

    <!-- x axis -->
    <text class="xAxisTitle title" x="{width / 2}" y="{height-padding.bottom}">{xAxisTitle}</text>
    <Axis {innerHeight} {padding} scale={xScale} position="bottom" />

    {#if data}
        <path 
        in:draw="{{duration: 3000}}"
        d={line_gen} 
        style="fill:transparent; stroke:black"/>
        {#each data as datapoint}
        <circle
            in:fade="{{duration: 1000, delay: 2500, easing: quintOut}}"
            use:tippy="{formatTooltip(datapoint)}"
            cx="{xScale(datapoint.year)}"
            cy="{yScale(datapoint.data)}"
            r="3px"
            ></circle>
        {/each}
    {/if}
  </svg>
</figure>