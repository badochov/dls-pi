import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Stack } from '../stack.model';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-stack-wrapper',
  templateUrl: './stack-wrapper.component.html',
  styleUrls: ['./stack-wrapper.component.scss']
})
export class StackWrapperComponent implements OnInit {
  stacks: Observable<Array<Stack>>;

  constructor(private Api: ApiService) {
    this.stacks = this.Api.getStackStates();
  }

  ngOnInit() {
  }

}
