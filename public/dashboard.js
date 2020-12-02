import React, { useEffect } from "react";
import Chart from "chart.js";
import axios from "axios";
import * as d3 from "d3";
import { entries } from "d3-collection";

function HomePage() {
    useEffect(() => {
      let title = [];
      let budget = [];
  
      axios.get(`http://localhost:3002/budget`).then((res) => {
        console.log(res);
        for (const dataObj of res.data.myBudget) {
          title.push(dataObj.title);
          budget.push(dataObj.budget);
        }
  
        // set the dimensions and margins of the graph
        var width = 450;
        var height = 450;
        var margin = 40;
  
        var radius = Math.min(width, height) / 2 - margin;
  
        // append the svg object to the div 
        var svg = d3
          .select("#my_dataviz")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
        // Create data
        var data = {};
        
        for(var i = 0; i < title.length; i++){
            data[title[i]] = budget[i];
        }
  
        console.log("print data ", data);
  
        // set color scale
        var color = d3
          .scaleOrdinal()
          .domain(title)
          .range(d3.schemeDark2);
  
        // Compute the position of each group on the pie:
        var pie = d3
          .pie()
          .sort(null) // Do not sort group by size
          .value(function (d) {
            return d.value;
          });
        var data_ready = pie(entries(data));
  
        // The arc generator
        var arc = d3
          .arc()
          .innerRadius(radius * 0.5)
          .outerRadius(radius * 0.8);
  
        var outerArc = d3
          .arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);
  
        // Build the pie chart
        svg
          .selectAll("allSlices")
          .data(data_ready)
          .enter()
          .append("path")
          .attr("d", arc)
          .attr("fill", function (d) {
            return color(d.data.key);
          })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7);
  
        // Add the polylines 
        svg
          .selectAll("allPolylines")
          .data(data_ready)
          .enter()
          .append("polyline")
          .attr("stroke", "black")
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr("points", function (d) {
            var posA = arc.centroid(d); 
            var posB = outerArc.centroid(d);
            var posC = outerArc.centroid(d); 
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; 
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
            return [posA, posB, posC];
          });
  
        svg
          .selectAll("allLabels")
          .data(data_ready)
          .enter()
          .append("text")
          .text(function (d) {
            console.log(d.data.key);
            return d.data.key;
          })
          .attr("transform", function (d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          })
          .style("text-anchor", function (d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midangle < Math.PI ? "start" : "end";
          });
  
        //other pie chart
        const ctx = document.getElementById("myChart");
  
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: title,
            datasets: [
              {
                label: "Budget",
                data: budget,
                backgroundColor: [
                  "#DAF7A6",
                  "#FFC300",
                  "FF5733",
                  "#C70039",
                  "#900C3F",
                  "#581845",
                  "#F0E68C",
                ],
                borderColor: [
                  "DAF7A6",
                  "#FFC300",
                  "FF5733",
                  "#C70039",
                  "#900C3F",
                  "#581845",
                  "#F0E68C",
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      });
      console.log(title, budget);
    });

    return (
        <header class="menu" role="Navigation Menu">

                <nav>
                    <ul>
                        <li><a href="./homepage.html">Homepage</a></li>
                        <li><a href="./dashboard.html">Dashboard</a></li>
                        <li><a href="./login.html">Login</a></li>
                        <li><a href="./logout.html">Logout</a></li>
                    </ul>
                </nav>
            </header>

        );
    }
    
    export default HomePage;