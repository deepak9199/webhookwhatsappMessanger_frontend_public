import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Webhookcreate } from '../_model/webhook';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {

  constructor(
    private http: HttpClient
  ) { }
  getwook(scode: string): Observable<any> {
    return this.http.post("https://node.express.tensoftware.in", { type: 'webhook', scode: scode })
    // return this.http.post("http://localhost:3000", { type: 'webhook', scode: scode })
  }
  createwook(webhookcreate: Webhookcreate): Observable<any> {
    return this.http.post("https://node.express.tensoftware.in", {
      type: "send-webhook-whatsapp",
      apino: webhookcreate.apino,
      cname: webhookcreate.cname,
      phone: webhookcreate.phone,
      waid: webhookcreate.waid,
      msgs: webhookcreate.msgs
    })
    // return this.http.post("http://localhost:3000", {
    //   type: "send-webhook-whatsapp",
    //   apino: webhookcreate.apino,
    //   cname: webhookcreate.cname,
    //   phone: webhookcreate.phone,
    //   waid: webhookcreate.waid,
    //   msgs: webhookcreate.msgs
    // })
  }
}
