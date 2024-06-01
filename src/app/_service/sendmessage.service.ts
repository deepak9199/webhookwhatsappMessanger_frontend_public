import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sendmessage } from '../_model/sendmessage';

@Injectable({
  providedIn: 'root'
})
export class SendmessageService {
  private passCode: string = '@ten@9234434490!#$'
  constructor(
    private http: HttpClient
  ) { }
  sendmessage(data: sendmessage): Observable<any> {
    return this.http.post("https://node.express.tensoftware.in", {
      type: 'send-message-whatsapp',
      scode: data.scode,
      toPhoneNumber: data.toPhoneNumber,
      messageContent: data.messageContent
    })
    // return this.http.post("http://localhost:3000", {
    //   type: 'send-message-whatsapp',
    //   scode: data.scode,
    //   toPhoneNumber: data.toPhoneNumber,
    //   messageContent: data.messageContent
    // })
  }
}
