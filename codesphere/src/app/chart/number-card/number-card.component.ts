import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ScaleType} from "@swimlane/ngx-charts";

interface single{
  name: string,
  value: number
}
@Component({
  selector: 'app-number-card',
  templateUrl: './number-card.component.html',
  styleUrls: ['./number-card.component.scss']
})
export class NumberCardComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() name: string = '';
  @Input() bottomColorInp: string = '#5AA454';
  @Input() cardColorInp: string = '#232837';

  cardColor: string = '#232837';
  view: [number, number] = [300, 200];
  constructor() { }
  data: single[] = [];
  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454']
  };

  ngOnInit(): void {
    this.updateData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
  }
  private updateData(): void {
    this.data = [
      {
        name: this.name,
        value: this.value
      }
    ];
    this.cardColor = this.cardColorInp;
    this.colorScheme = {
      name: 'myScheme',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: [this.bottomColorInp]
    };
  }

}
