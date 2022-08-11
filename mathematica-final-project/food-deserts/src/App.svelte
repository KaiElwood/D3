<script lang='ts'>


	let name = 'kai';
	let name2 = 'Final Project';
  	import Map from './components/map.svelte'
  	import Scatter from './components/scatter.svelte'
  	import Linegraph from './components/line-graph.svelte'
	import Scrolly from "./Scrolly.svelte";
	import parseData from './Data.js'
	// import Scatterplot from "./Scatterplot.svelte";
	const dataSrc = {
		chart1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTY2WjTSxbE2evOXU9Nz-lzi0YcGpJnp2SggBd96mwLniI2oHsPcFGPmkowDprbAFeuluZAGHbk9Tw_/pub?output=csv',
		chart2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXNmppyXOKfEedHeinV60lYBzrE_gyyFd1r-8_bBlHjljixP5LEQnKiktnDaYg4GsHQ5BiVxqk2hk2/pub?output=csv',
		chart3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8R7aocgbUM4L722IUI0_85qHhfoQ9ho2STBOgpTla_UwGgEGv-6G_eylHnQp0-thV0oAmoOedup7k/pub?output=csv'
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
				<img src="./images/lettuce-removebg-preview.png" class='lettuce' alt="lettuce">
				<img src="./images/Carrot-removebg-preview.png" class='carrot' alt="Carrot">
				<img src="./images/watermelon-removebg-preview.png" class='watermelon' alt="Carrot">
				<h1>Food Deserts in the US</h1>
				<h2>{name2}</h2>
				<p>Can we identify aspects of food deserts at a county level?</p>
			</div>
		</div>
	</div>
	<!-- <Scrolly>></Scrolly> -->
	{ #await allData}
		<p>Loading!</p>
	{:then allData} 
		<p>
			Food deserts are a real problem in the US. Loosely defined as geographic areas where residents' access to affordable, healthy food options (especially fresh fruits and vegetables) are limited, food deserts are typically looked at from a local perspective, due to the complicated nature of food access. Access to healthy foods may be limited by transportation options, income differences, and proximity. When evaluating areas that may be food deserts, regional and county-level data are typically not used, due to inaccuracies that may arise from aggregating at the county level. However, county-level data can tell us some interesting things about food deserts. Let's explore!
		</p>
		<p>
			In the below graph, counties with average grocery stores per 1000 residents lower than 0.1 are defined as food deserts. From 2013-2016, the total number of food deserts increased.
		</p>
		<div data-cy='line-graph'>
			<Linegraph data={allData[0]} titles={['Percent of Counties', 'Year','Percent of counties with fewer than 0.1 Grocery Stores per 1,000 residents']} />
		</div>
		<p>
			An important aspect of food deserts is that they often are found in lower income areas. However, at the county level, it's difficult to spot a defined trend between per capita income and grocery stores per 1,000 residents, as you can see in the graph below.
		</p>
		<div data-cy="scatterplot">
			<Scatter data="{allData[1]}"
			titles={['Per Capita Income', 'Grocery Stores Per 1000 People','Grocery Stores and Per Capita Income, Average 2013-2016']}/>
		</div>
		<p>
			Perhaps one reason there is no clearly defined trend in the data is the size of the grocery stores in each county. While Arlington County in Virginia has a higher income per capita and a much larger population than Yakutat City and Bourough in Alaska, It has fewer grocery stores per resident. This may be due to differences in square footage of grocery stores in Alaska and in Virginia -- a larger grocery store may be able to feed more residents.
		</p>
		<p>
			What is the trend over time? The following graph explores the connection between poverty and grocery stores per capita. Poverty is measured by the percent of people in each county who are considered in poverty by the US Census (income level at or below the poverty threshold). Greener areas represent fewer grocery stores per capita and a lower percentage of people in poverty, pink areas represent more grocery stores per capita and a higher percentage of people in poverty, and darker areas represent both fewer grocery stores and higher percentage of people in poverty.
		</p>
		<div data-cy="countymap">
			<Map data={allData[2]} filteredData={allData[3]}/>
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