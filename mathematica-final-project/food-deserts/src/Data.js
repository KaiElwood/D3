import * as d3Fetch from 'd3-fetch';

function parseData({ src }) {

  const chart1Promise = d3Fetch.csv(src.chart1)
  const chart2Promise = d3Fetch.csv(src.chart2)
  
  let data = Promise.all([chart1Promise, chart2Promise]).then(res => {
    console.log(res)
    // console.log(res)
    let [initialdata] = res;
    console.log('initial data', initialdata)

    let chart1Data = Object.entries(res[0][1]).reduce((acc,d) => {
        let newObj = {}
        if (d[0] == '')
          return acc
        newObj.year = +d[0];
        newObj.data = +d[1];
        acc.push(newObj)
        return acc;
    },[])

    let allCounties = res[1].map(d => {
      // poverty is percent of people under a ratio of 1 for poverty to income
      d.poverty = +d.ACS_PCT_PERSON_INC99;
      // percapincome is income per capita for the county
      d.perCapIncome = +d.ACS_PER_CAPITA_INCOME;
      // grocerystores is number of stores per 1000 people
      d.groceryStores = +d.CCBP_RATE_SOGS_PER_1000;
      return d
    });


    // // get all unique minerals
    // let minerals = [...new Set(allMinerals)];

    // // correct to input number strings as ints, then filter to remove nan values
    // let correcteddata = initialdata.map((d) => {
    //   const checkNaN = a => {
    //     if (isNaN(a)) {
    //       d.isNan = true;
    //       return false;
    //     } else {
    //       d.isNan = false;
    //       return parseInt(a);
    //     }
    //   }

    //   d.production2020 = checkNaN(d.production2020);
    //   d.reserves2020 = checkNaN(d.reserves2020);
    //   return d;
    // }).filter((d) => !d.isNan);



    // let dataset = minerals.map((mineral) => ({
    //   mineral: mineral, 
    //   mineralData: correcteddata.filter(d => d.mineral === mineral),
    //   totalProduction: 0,
    //   totalReserves: 0
    // }));

    // for(let x = 0; x < minerals.length; x++) {
    
        
    //   dataset[x].mineralData.forEach(d => {
    //     d.percentReserves = ((d.reserves2020 / dataset[x].totalReserves)*100);
    //     d.percentProduction = ((d.production2020 / dataset[x].totalProduction)*100);
    //   })
    // }
    // return dataset
    console.log('final data', [chart1Data, allCounties])
    return [chart1Data, allCounties]
  })
  
  return data
}

export default parseData;
