import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: false
})
export class TextComponent implements OnInit {

  @Input() title: string;
  @Output() filterByProductName = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterByProductName.emit(value);
  }
}
