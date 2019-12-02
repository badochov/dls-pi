import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Stack } from "./stack.model";

import { map } from "rxjs/operators";
import { QrString } from "./qr-string.model";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  public getStackStates(): Observable<Array<Stack>> {
    return this.httpClient.get<Array<Stack>>(API_URL + "/stacks");
  }

  public getText(points: number): Observable<string> {
    return this.httpClient.get<string>(API_URL + "/text");
  }
}
