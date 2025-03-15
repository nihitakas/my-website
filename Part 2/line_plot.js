const socialMediaTime = d3.csv("SocialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to proper types
    data.forEach(d => {
        d.Date = new Date(d.Date); // Convert to Date object
        d.AvgLikes = +d.AvgLikes;  // Convert to number
    });

    console.log(data); // Debugging: Check if data is loaded correctly

    // Define the dimensions and margins for the SVG
    const margin = { top: 50, right: 30, bottom: 70, left: 50 },
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#lineplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales for x and y axes  
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date)) // Set min & max for Date
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)]) // Set min & max for AvgLikes
        .nice()
        .range([height, 0]);

    // Draw the x-axis with rotated text
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(7).tickFormat(d3.timeFormat("%b %d"))) // Format date ticks
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-25)");

    // Draw the y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .text("Date");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Average Likes");

    // Define the line generator
    const line = d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.AvgLikes))
        .curve(d3.curveNatural); // Smooth curve

    // Draw the line path
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
});
