const DATASET_URL="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
d3.json(DATASET_URL).then(data=>{
  const w=1000;
  const h=500;
  const padding=40;

  const dataset=data.data.map(item=>{
    let timeArr = item[0].split('-');
    return [parseInt(timeArr[0])+0.25*(Math.floor(parseInt(timeArr[1])/3)),item[1]]
  });
  const years=dataset.map(item=>item[0]);
  const gdps=dataset.map(item=>item[1]);
  const xScale=d3.scaleLinear().domain([d3.min(years),d3.max(years)]).range([padding, w-padding]);
  const yScale=d3.scaleLinear().domain([0,d3.max(gdps)]).range([h-padding, padding]);
  const heightScale=d3.scaleLinear().domain([0,d3.max(gdps)]).range([0, h-2*padding]);

  const tips=d3.select("#svg-container").append("div").attr("id", "tips").style("left", '-10000px');
  tips.append("text").attr("id", "tips-time");
  tips.append("text").attr("id", "tips-gdp");

  const svg=d3.select("#svg-container").append("svg").attr("width", w).attr("height", h);

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x", d=>xScale(d[0]))
     .attr("y", d=>yScale(d[1]))
     .attr("width", w/gdps.length)
     .attr("height", d=>heightScale(d[1]))
     .attr("fill", "navy")
     .attr("class", "bar")
     .on("mouseover", function(d, i){
       tips.style("left", `${padding+xScale(d[0])}px`);
       d3.select("#tips-time").text(`${parseInt(d[0])} Q${(d[0]%1)*4+1}`)
       d3.select("#tips-gdp").text(`$${d[1]} billions`);
     })
     .on("mouseout", function(){
       tips.style("left", `-10000px`);
     });
  
  const xAxis=d3.axisBottom(xScale);
  xAxis.tickFormat(d3.format(".0d"));
  svg.append("g")
     .attr("transform", `translate(0, ${h-padding})`)
     .call(xAxis);

  const yAxis=d3.axisLeft(yScale);
  svg.append("g")
     .attr("transform", `translate(${padding},0)`)
     .call(yAxis);

  svg.append("text")
     .text("Gross Domestic Product (billion USDs)")
     .attr("transform", "rotate(-90)")
     .attr("x", -300)
     .attr("y", 55);
});
