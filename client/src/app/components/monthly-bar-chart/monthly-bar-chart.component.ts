import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import _orderBy from 'lodash.orderby';
import * as d3 from 'd3';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-monthly-bar-chart',
  templateUrl: './monthly-bar-chart.component.html',
  styleUrls: ['./monthly-bar-chart.component.scss'],
})
export class MonthlyBarChartComponent implements OnInit, OnChanges {
  @Input() data: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.createChart(changes.data.currentValue);
    }
  }

  ngOnInit() {}

  onResize(ev: any) {
    this.createChart(this.data);
  }

  createChart(data: any[]) {
    if (!data) {
      return;
    }

    d3.select('#chartmonthly').select('svg').remove();

    if (data.length === 0) {
      return;
    }

    const margin = { top: 10, right: 20, bottom: 20, left: 38 };
    const width = window.innerWidth;
    const height = width * 0.52;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#chartmonthly').append('svg').attr('width', width).attr('height', height).append('g');

    svg.append('g').attr('class', 'axis-y');
    svg.append('g').attr('class', 'axis-x');
    svg.append('g').attr('class', 'bars-income');
    svg.append('g').attr('class', 'bars-expense');

    svg.attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .rangeRound([0, innerWidth])
      .padding(0.25)
      // .paddingInner(0.35)
      .domain(data.map(d => d.month.substring(0, 3)));

    svg.select('.axis-x').call(d3.axisBottom(xScale)).attr('transform', `translate(0,${innerHeight})`);

    const yScale = d3
      .scaleLinear()
      .rangeRound([innerHeight, 0])
      .domain([0, d3.max(data, d => (d.incomeTotal > d.expenseTotal ? d.incomeTotal : d.expenseTotal))])
      .nice();

    svg.select('.axis-y').call(d3.axisLeft(yScale).ticks(5).tickSizeInner(-innerWidth).tickSizeOuter(3));

    const xScale1 = d3
      .scaleBand()
      .padding(0.25)
      .domain(['incomeTotal', 'expenseTotal'])
      .rangeRound([0, xScale.bandwidth()]);

    const chart = svg
      .selectAll('.chart')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'chart')
      .attr('transform', d => `translate(${xScale(d.month.substring(0, 3))},0)`);

    chart
      .selectAll('.bars-income')
      .data(d => {
        return [d];
      })
      .enter()
      .append('rect')
      .attr('class', 'bar-income')
      .attr('x', d => xScale1('incomeTotal'))
      .attr('y', d => yScale(d.incomeTotal))
      .attr('width', xScale1.bandwidth())
      .attr('height', d => Math.abs(innerHeight - yScale(d.incomeTotal)));

    chart
      .selectAll('.bars-expense')
      .data(d => [d])
      .enter()
      .append('rect')
      .attr('class', 'bar-expense')
      .attr('x', d => xScale1('expenseTotal'))
      .attr('y', d => yScale(d.expenseTotal))
      .attr('width', xScale1.bandwidth())
      .attr('height', d => Math.abs(innerHeight - yScale(d.expenseTotal)));
  }
}
