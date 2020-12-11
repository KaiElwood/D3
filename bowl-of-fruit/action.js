// importing functions – make sure everything is imported as a module, and then you can specify which functions you'd like to export or import
import { fruitbowl as fruitBowl} from './fruits.js';

function createElements(){
    const svg = d3.select('svg')
        .attr('height', innerHeight)
        .attr('width', innerWidth);
    
    // what data does each fruit contain? we can give it a type and an ID
    const makeFruit = type => ({
        type,
        id: Math.random()
    });

    let fruits = d3.range(5)
        .map(() => makeFruit('apple'));

    const render = () => {
        fruitBowl(svg, {
            fruits
        })
    };

    render();

    // eating an apple
    setTimeout(() => {
        console.log("One apple down!")
        fruits.pop();
        render();
    }, 1000);

    // replacing with lemon
    // this will not work unless we use update pattern!!!
    setTimeout(() => {
        console.log("One lemon down!")
        fruits[2].type = "lemon";
        render(svg, { fruits });
    }, 2000);

    // eating an apple
    setTimeout(() => {
        fruits = fruits.filter((d, i) => i !== 1);
        render();
    }, 3000);

}

createElements();