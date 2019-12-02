import {Component, OnInit, Input} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  text: Observable<string>;

  constructor(private Api: ApiService) {
    this.text = this.Api.getText();
  }

  ngOnInit() {
  }

}
