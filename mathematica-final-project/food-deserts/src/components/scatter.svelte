<script>
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { scaleLinear } from 'd3-scale';
  import { extent } from "d3-array";
  import Axis from "./Axis.svelte";
  import tippy from 'sveltejs-tippy'

  export let data
  export let titles

  let figure
  let width = 800
  let height = 400

  let yAxisTitle = titles[0];
  let xAxisTitle = titles[1];
  let mainTitle = titles[2];

  const padding = { top: 35, right: 65, bottom: 35, left: 65 }

  let xMinMax = extent(data, (d)  =>  d.groceryStores);
  let yMinMax = extent(data, (d)  =>  d.perCapIncome);

  let innerHeight = height - padding.bottom - padding.top;
  let yExtension = 0;

  $: xScale = scaleLinear()
  .domain(xMinMax)
  .range([0+padding.left, width-padding.right]);

  $: yScale = scaleLinear()
      .domain([yMinMax[0]-yExtension, yMinMax[1]+yExtension])
      .range([innerHeight, padding.top])

  const formatTooltip = (data) => {
      const template = `
      <div>${data?.COUNTY}, ${data?.STATE}</div>
      <p><span>Grocery Stores Per 1000 People:</span> ${data?.groceryStores}</p>
      <p><span>Income per Capita:</span> ${data?.perCapIncome}</p>
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
<svg class="scatterchart" {width} {height}>

  <text class="mainTitle title" x="{width/2}" y="{padding.top}">{mainTitle}</text>

  <!-- y axis -->
  <text class="yAxisTitle title" x="{0}" y="{padding.left-padding.right-10}" style='transform: translate({padding.left/3}px, {innerHeight/2}px) rotate(-90deg);'>{yAxisTitle}</text>
  <Axis {innerHeight} {padding} scale={yScale} position="left" />

  <!-- x axis -->
  <text class="xAxisTitle title" x="{width / 2}" y="{height-padding.bottom}">{xAxisTitle}</text>
  <Axis {innerHeight} {padding} scale={xScale} position="bottom" />

  
  <!-- check data exists, update on change to selectedIndicator -->
  {#if data}
      <!-- {#key selectedIndicator} -->/
      {#each data as datapoint}
      <circle
          in:fade="{{duration: 2000, easing: quintOut}}"
          use:tippy="{formatTooltip(datapoint)}"
          cx="{xScale(datapoint.groceryStores)}"
          cy="{yScale(datapoint.perCapIncome)}"
          r="3px"
          fill='black'
          ></circle>
      {/each}
  {/if}
</svg>
</figure>
