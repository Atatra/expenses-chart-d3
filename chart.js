const displayChart = (h, rectW, padding, gap, roundedCorner) => {
  fetch("./public/data.json")
    .then((response) => response.json())
    .then((dataset) => {
      const w = (rectW + gap) * dataset.length - gap + 2 * padding;
      const svg = d3.select("svg").attr("height", h).attr("width", w);

      const heightScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.amount)])
        //.range([padding, h - padding]);
        .range([padding, h - padding * 2.7]);

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
        //.attr("height", (d) => {
        //  return yScale(d.amount);
        //})
        .attr("height", (d) => heightScale(d.amount))

        .attr("x", (d, i) => i * (rectW + gap) + padding)
        .attr("y", (d) => h - (heightScale(d.amount) + padding))
        .attr("rx", roundedCorner)
        .attr("ry", roundedCorner)

        // Tooltip
        .on("mouseover", function (mouseEvent, d) {
          const xPosition = parseFloat(d3.select(this).attr("x")) + rectW / 2;
          const yPosition = parseFloat(d3.select(this).attr("y")) - 10;

          svg
            .append("rect")
            .attr("class", "barTooltipBack")
            .attr("x", xPosition - 28)
            .attr("y", yPosition - 23)
            .attr("width", 56)
            .attr("height", 26)
            .attr("fill", "var(--dBrown)")
            .attr("rx", 3);

          svg
            .append("text")
            .attr("class", "barTooltipText")
            .attr("x", xPosition)
            .attr("y", yPosition - 5)
            .attr("text-anchor", "middle")
            .text(`$${d.amount}`);
        })
        .on("mouseout", function () {
          svg.selectAll(".barTooltipText").remove();
          svg.selectAll(".barTooltipBack").remove();
        });

      /** Plot chart labels */
      svg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text((d) => d.day)
        .attr("x", (d, i) => i * (rectW + gap) + padding + rectW / 2)
        .attr("y", (d) => h)
        .attr("class", "barLabel")
        .attr("text-anchor", "middle");
    })

    .catch((error) => console.log(error));
};

function displayChartResponsive(media) {
  d3.select("svg").selectAll("*").remove();
  if (media.matches) {
    displayChart(180, 31, 20, 15, 3);
  } else {
    displayChart(180, 50, 20, 15, 3);
  }
}

var x = window.matchMedia("(max-width: 40em)");
displayChartResponsive(x);

x.addEventListener("change", function () {
  displayChartResponsive(x);
});

const getDay = () => {
  /** Return 0 for Monday... 6 for Sunday */
  return new Date().getDay() - 1;
};
