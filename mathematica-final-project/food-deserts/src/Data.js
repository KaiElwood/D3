import * as d3Fetch from 'd3-fetch';
import counties from './assets/counties.json'

function parseData({ src }) {

  const chart1Promise = d3Fetch.csv(src.chart1)
  const chart2Promise = d3Fetch.csv(src.chart2)
  const chart3Promise = d3Fetch.csv(src.chart3)
  
  let data = Promise.all([chart1Promise, chart2Promise, chart3Promise]).then(res => {
    console.log(res)
    // console.log(res)
    let [initialdata] = res;
    console.log('initial data', initialdata)

    let chart1Data = Object.entries(res[0][2]).reduce((acc,d) => {
      console.log(d)
        let newObj = {}
        if (d[0] == '')
          return acc
        newObj.year = +d[0];
        newObj.data = +d[1];
        console.log(newObj)
        acc.push(newObj)
        return acc;
    },[])

    let chart2Data = res[1].map(d => {
      // poverty is percent of people under a ratio of 1 for poverty to income
      d.poverty = +d.ACS_PCT_PERSON_INC99;
      // percapincome is income per capita for the county
      d.perCapIncome = +d.ACS_PER_CAPITA_INCOME;
      // grocerystores is number of stores per 1000 people
      d.groceryStores = +d.CCBP_RATE_SOGS_PER_1000;
      return d
    });

    // create new object of a lot of objects with id as the key for each one, rather than an array of objects!
    console.log(counties);

    let combinedGeoCountyData = new Map();
    counties.features.map(d => {
      let str = d.properties.GEO_ID;
      let ID = str.substring(str.indexOf("S") + 1);
      combinedGeoCountyData.set(ID, d);
    })

    console.log(combinedGeoCountyData);

    let dataArray = {x: [], y: []};

    res[2].map(d => {
      d.poverty = +d.ACS_PCT_PERSON_INC99;
      dataArray.x.push(+d.ACS_PCT_PERSON_INC99);
      dataArray.y.push(+d.CCBP_RATE_SOGS_PER_1000);
      // percapincome is income per capita for the county
      d.perCapIncome = +d.ACS_PER_CAPITA_INCOME;
      // grocerystores is number of stores per 1000 people
      d.groceryStores = +d.CCBP_RATE_SOGS_PER_1000;

      // here i need to get and then set
      // console.log("data element:", d)
      let mapEl = combinedGeoCountyData.get(d.FIPSCODE);
      // console.log('state element', mapEl);
      (mapEl.properties.data ||= []).push(d);
      combinedGeoCountyData.set(d.FIPSCODE, mapEl);
    })
    
    let chart3Data = {type: 'FeatureCollection', features: [...combinedGeoCountyData].map(d => d[1])};

    dataArray.x.sort((a,b) => a-b);
    dataArray.y.sort((a,b) => b-a);

    console.log('final data', [chart1Data, chart2Data, chart3Data])
    return [chart1Data, chart2Data, chart3Data, dataArray]
  })
  
  return data
}

export default parseData;
