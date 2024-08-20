const displayChart = (h, rectW, padding, gap, roundedCorner) => {
  fetch("/data.json")
    .then((response) => response.json())
    .then((dataset) => {
      const w = (rectW + gap) * dataset.length - gap;
      const svg = d3.select("svg").attr("height", h).attr("width", w);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.amount)])
        .range([padding, h - padding]);

      /** Plot bar dynamically */
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
        .attr("y", (d) => h - (yScale(d.amount) + padding))
        .attr("rx", roundedCorner)
        .attr("ry", roundedCorner);

      /** Plot chart labels */
      svg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text((d) => d.day)
        .attr("x", (d, i) => i * (rectW + gap) + rectW / 2)
        .attr("y", (d) => h)
        .attr("class", "barLabel")
        .attr("text-anchor", "middle");
    })

    .catch((error) => console.log(error));
};

function displayChartResponsive(media) {
  d3.select("svg").selectAll("*").remove();
  if (media.matches) {
    displayChart(180, 31, 25, 15, 3);
  } else {
    displayChart(180, 50, 25, 15, 3);
  }
}

var x = window.matchMedia("(max-width: 40em)");
displayChartResponsive(x);

x.addEventListener("change", function () {
  console.log("changed!");
  displayChartResponsive(x);
});

const getDay = () => {
  /** Return 0 for Monday... 6 for Sunday */
  return new Date().getDay() - 1;
};
