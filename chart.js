const h = 150;
const w = 700;
const rectW = 40;
const padding = 0;
const gap = 15;
const roundedCorner = 5;

fetch("./public/data.json")
  .then((response) => response.json())
  .then((dataset) => {
    const svg = d3.select("svg").attr("height", h).attr("width", w);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.amount)])
      .range([padding, h - padding]);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", (d, i) => {
        if (i === getDay()) return "barToday";
        return "bar";
      })
      .attr("width", rectW)
      .attr("height", (d) => {
        console.log(d.day, yScale(d.amount));
        return yScale(d.amount);
      })
      .attr("x", (d, i) => i * (rectW + gap))
      .attr("y", (d) => h - yScale(d.amount))
      .attr("rx", roundedCorner)
      .attr("ry", roundedCorner);
  })
  .catch((error) => console.log(error));

const getDay = () => {
  /** Return 0 for Monday... 6 for Sunday */
  return new Date().getDay() - 1;
};
