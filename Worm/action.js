var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

window.addEventListener("resize", ()=> {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    console.log(width);
    width = windowWidth - margin.left - margin.right;
    height = windowHeight - margin.top - margin.bottom;
});

// set margin and width/height of svg space
var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = windowWidth - margin.left - margin.right,
    height = windowHeight - margin.top - margin.bottom;

// set x value array – I could just use the map function, but d3.scaleLinear has some cool properties such as querying the initial domain on click, etc
var x = d3.scaleLinear()
    .domain([0, 5.9])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([-1,1])
    .range([height, 0]);

var z = d3.scaleLinear()
    .domain([0,5.9])
    .range([0,360]);

// input is range from 0 to 6 with step of .1 
// points go through map to each section and return to array of objects
var points = d3.range(0, 6, .1).map((t) => {
    return {value: t, 0: x(t), 1:y(Math.sin(t))};
});

// create svg element and center group within the element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// selects all path elements, if there are none, returns empty array
var path = svg.selectAll("path")
//  this will iterate over each value withint the variable given, similar to a forEach loop or enhanced for loop
    .data(quad(points))
// this adds each instance of a data point to a new path element, append will add it to the body
    .enter().append("path")
// this creates a function that grabs the value from the first position in the array for each data point and runs it through our z variable to return a color
    .style("fill", function(d) { return d3.hsl(z(d[1].value), 1, .6);});
// this adds a simple black stroke around each element
    // .style("stroke", "#000");

// retrieve initial time
var t0 = Date.now();

// similar to setTimeout, timer invokes a function every milisecond
d3.timer(()=> {
    // returns current time
    var dt = (Date.now() - t0) *.001;
    // for each point in points, passing in data from the point into the function, sets element 1 in each point to var y of the scale aspect of the point. this equates to the sin of the current value plus the current time (allows for change)
    points.forEach((d) => {d[1] = y(d.scale = Math.sin(d.value + dt)); });
    // points.forEach().style("fill", "black");
    path;
    // 
    path.attr("d", (d) => {return lineJoin(d[0], d[1], d[2], d[3], 80 * d[1].scale * d[1].scale + 15)});
});

// 
function quad(points){
    // returns range of data points that will be projected, in sets of 4
    return d3.range(points.length -1).map((i)=> {
        return [points[i-1], points[i], points[i+1], points[i+2]];
    });
}

// compute stroke outline for segment p12
function lineJoin(p0, p1, p2, p3, width){
    var u12 = perp(p1, p2),
        r = width/2,
        a = [p1[0] + u12[0] * r, p1[1] + u12[1] *r],
        b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
        c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
        d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];

    if (p0) {
        var u01 = perp(p0, p1), e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
        a = lineIntersect(p1, e, a, b);
        d = lineIntersect(p1, e, d, c);
    }

    if (p3) { // clip ab and dc using average of u12 and u23
        var u23 = perp(p2, p3), e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
        b = lineIntersect(p2, e, a, b);
        c = lineIntersect(p2, e, d, c);
      }
    
    return "M" + a + "L" + b + " " + c + " " + d + "Z";
}

// compute intersection of two infinite lines ab and cd
function lineIntersect(a, b, c, d){
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
    ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [x1 + ua * x21, y1 + ua * y21];
}



// compute unit vector perpendicular to p01
function perp(p0, p1){
    var u01x = p0[1] - p1[1], u01y = p1[0] - p0[0],
        u01d = Math.sqrt(u01x * u01x + u01y * u01y);
    return [u01x / u01d, u01y/u01d];
}