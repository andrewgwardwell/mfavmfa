import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('tooltip', {static: true}) tooltipElt:ElementRef;
  @ViewChild('statesvg', {static: true}) statesvgElt:ElementRef;

  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit() {
  function mouseOver(d){
        d3.select("#tooltip").transition().duration(200).style("opacity", .9);      

        // d3.select("#tooltip").html(toolTip(d.n, data[d.id]))  
        //     .style("left", (d3.event.pageX) + "px")     
        //     .style("top", (d3.event.pageY - 28) + "px");
    }

    function mouseOut(){
        d3.select("#tooltip")
          .transition()
          .duration(500).style("opacity", 0);      
    }

    let uStatePaths = [];
    d3.select('#statesvg').selectAll(".state")
        .data(uStatePaths).enter()
        .append("path")
        .attr("class","state")
        .attr("d",function(d){ return d.d;})
        // .style("fill",function(d){ return data[d.id].color; })
        .on("mouseover", () => {
          d3.select("#tooltip")
            .transition()
            .duration(200)
            .style("opacity", .9);      
          // (...)
        })
        .on("mouseout", () => {
          // (...)
        });
  }

}
