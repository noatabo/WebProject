// Set the dimensions and margins of the graph
const margin = { top: 20, right: 30, bottom: 60, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Parse the data and extract the sales per month
console.log(data)
// Create the SVG element
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define the X and Y scales
const xScale = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.2);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.sales)])
    .range([height, 0]);

// Draw the X and Y axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

svg.append("g")
    .call(yAxis);

// Draw the bars
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale(d.month))
    .attr("y", d => yScale(d.sales))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.sales))
    .attr("fill", "steelblue");
