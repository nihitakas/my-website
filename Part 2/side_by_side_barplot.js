// Load the cleaned dataset
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;
    });

    // Define dimensions and margins
    const margin = { top: 50, right: 250, bottom: 50, left: 60 }, // Increased right margin
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#barplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x0 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.Platform))])
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.PostType))])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.PostType))])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Platform");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Average Likes");

    // Group container for bars
    const barGroups = svg.selectAll(".bar-group")
        .data(d3.group(data, d => d.Platform))
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d[0])},0)`);

    // Draw bars
    barGroups.selectAll("rect")
        .data(d => d[1])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.PostType))
        .attr("y", d => y(d.AvgLikes))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.AvgLikes))
        .attr("fill", d => color(d.PostType));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 40}, ${margin.top})`); // Adjusted legend positioning

    const types = [...new Set(data.map(d => d.PostType))];

    types.forEach((type, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 30) // Increased spacing between legend items
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(type));

        legend.append("text")
            .attr("x", 25) // Improved text alignment
            .attr("y", i * 30 + 14) // Better vertical positioning
            .text(type)
            .attr("alignment-baseline", "middle")
            .style("font-size", "14px");
    });
});
