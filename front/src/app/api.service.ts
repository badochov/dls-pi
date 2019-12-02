import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Stack} from './stack.model';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private socket: Socket) {
  }

  public getStackStates(): Observable<Array<Stack>> {
    return this.socket.fromEvent('stacks');
  }

  public getText(): Observable<string> {
    return this.socket.fromEvent('text');
  }
}
