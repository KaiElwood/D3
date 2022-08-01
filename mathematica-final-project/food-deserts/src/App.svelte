<script lang='ts'>


	let name = 'kai';
	let name2 = 'kai';
	// import parseData from './data.js'
  	// import Map from './components/map.svelte'
  	// import Scatter from './components/scatter.svelte'
  	import Linegraph from './components/line-graph.svelte'
	import Scrolly from "./Scrolly.svelte";
	import * as d3Fetch from 'd3-fetch';
	import parseData from './Data.js'
	// import Scatterplot from "./Scatterplot.svelte";
	const dataSrc = {
		chart1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTY2WjTSxbE2evOXU9Nz-lzi0YcGpJnp2SggBd96mwLniI2oHsPcFGPmkowDprbAFeuluZAGHbk9Tw_/pub?output=csv',
		chart2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXNmppyXOKfEedHeinV60lYBzrE_gyyFd1r-8_bBlHjljixP5LEQnKiktnDaYg4GsHQ5BiVxqk2hk2/pub?output=csv',
		chart3: ''
	}

	const allData = loadData()

	async function loadData() {
		let res = await parseData({
		src: dataSrc,
		})
		return res
	}
	
  	let value;
	let totalFruits = 10;

	for(let i=0; i<totalFruits; i++) {
		
	}

	const init = () => {
    resize(mq)
  }

  let isMobile = false
  let mq = window.matchMedia('(max-width: 48em)')

  function resize(mediaQueryList) {
    if (mediaQueryList.matches) {
      isMobile = true
    } else {
      isMobile = false
    }
  }

  try {
    // Chrome & Firefox
    mq.addEventListener('change', (e) => {
      resize(e)
    })
  } catch (e1) {
    try {
      // Safari, because it doesn't support addEventListener...
      mq.addListener((e) => {
        resize(e)
      })
    } catch (e2) {
      console.error(e2)
    }
  }

  window.addEventListener('DOMContentLoaded', init)


</script>


<!-- in main, I will have a scrollytelling explainer of everything that I'm trying to say.
 the scrolly will animate sand particles and food blowing across the desert, and if possible will also lead to
one of the letters on the title falling off.
then, the next page will be a simple graph of number of counties with fewer than US average access to grocery stores
this graph will show the trend
then, the next graph will be a scatter plot of counties' poverty level and grocery store access over time.
perhaps I could leave a trail marker on the graph and track each county? tbd
then, the last graph will be a bivariate choropleth of poverty and food access
all of these things will be activated by scrollytelling.
I will have a variable that registers scroll height, and this variable will lead to different things showing-->

<main>

	<div>
		<div data-cy='sand-particles' class='bg-sand'>
			<div class="title">
				<h1>Food Deserts</h1>
				<h2>{name2}</h2>
				<p>Intro text about project</p>
			</div>
			<!-- <img src="assets/lettuce-removebg-preview.png" alt="lettuce">
			<img src="assets/Carrot-removebg-preview.png" alt="Carrot"> -->
		</div>
	</div>
	<!-- <Scrolly>></Scrolly> -->
	{ #await allData}
		<p>Loading!</p>
	{:then allData} 
		<div data-cy='line-graph'>
			<Linegraph data={allData[0]} titles={['Number of Counties', 'Year','Number of counties with fewer than 0.1 Grocery Stores per 1,000 residents']} />
			here is some placeholder text that will appear under the line graph
		</div>
		<div data-cy="scatterplot">
			<!-- <Scatter data="{data}"
			titles="yes"
			selectedIndicator={selectedIndicator}
			isMobile="{isMobile}"/> -->
		</div>
		<div data-cy="countymap">
			<!-- <Map  {data} /> -->
		</div>
	{/await}
</main>

<style>
	.bg-sand {
		height: 100%;
		background-color: antiquewhite;
	}
	.title {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.title h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>