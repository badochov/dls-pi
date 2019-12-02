import {Component, OnInit, Input} from '@angular/core';
import {Stack} from '../stack.model';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss']
})
export class StackComponent implements OnInit {
  @Input() stack: Stack;

  constructor() {
  }

  ngOnInit() {
  }

}
