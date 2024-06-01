import { Component, ElementRef, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Conversation, Message } from './_model/message.';
import { sendmessage } from './_model/sendmessage';
import { Webhook, Webhookcreate } from './_model/webhook';
import { SendmessageService } from './_service/sendmessage.service';
import { WebhookService } from './_service/webhook.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WebHookMessanger';
  web_hook_list: Webhook[] = []
  phone_list: Webhook[] = []
  selectedCustomerIndex: number = 0;
  phone_list_msg: Conversation[] = []
  currentChatMessages: Message[] = []
  messageData: string = ''
  msg_index: number = 0;
  scode: string = 'SO111'
  bussinessid: string = ''
  phoneid: string = ''
  constructor(
    private webhook: WebhookService,
    private toster: ToastrService,
    private elementRef: ElementRef,
    private ngZone: NgZone, // Added NgZone
    private sendmessageservice: SendmessageService,
  ) { }
  ngOnInit() {
    this.ngZone.run(() => {
      this.gethookapi(this.scode)
    });
  }
  gethookapi(scode: string) {
    this.webhook.getwook(scode).subscribe({
      next: (data: Webhook[]) => {
        this.web_hook_list = data
        this.bussinessid = this.web_hook_list[0].bussinessid
        this.phoneid = this.web_hook_list[0].phoneid
        this.phone_list = Object.values(this.web_hook_list.reduce((acc, item) => ({ ...acc, [item.phoneno]: item }), {}));
        this.phone_list.map((item: Webhook) => {
          let data: Webhook[] = this.web_hook_list.filter((obj: Webhook) => obj.phoneno === item.phoneno)
          let messageData: Conversation = {
            cname: item.cname,
            phoneno: item.phoneno,
            messages: []
          }
          data.map((m: Webhook) => {
            if (m.msg != '') {
              if (m.entry_type === 'incoming') {
                let megdata: Message = {
                  type: 'incoming',
                  text: m.msg,
                  time: this.formatTime(this.unixToDateTime(Number(m.entry_time))),
                  date: this.formatDate(new Date(m.entry_date))
                }
                messageData.messages.push(megdata)
              } else if (m.entry_type === 'outgoing') {
                let megdata: Message = {
                  type: 'outgoing',
                  text: m.msg,
                  time: this.formatTime(this.unixToDateTime(Number(m.entry_time))),
                  date: this.formatDate(new Date(m.entry_date))
                }
                messageData.messages.push(megdata)
              }
              else {
                // console.error('webhook entry_type error : ' + m.entry_type)
              }
            }
          })
          this.phone_list_msg.push(messageData)
        })
        setTimeout(() => {
          this.scrollToTop();
        }, 100);
        // console.log(this.phone_list_msg)
      },
      error: err => {
        this.toster.error(err.message)
      }
    })
  }
  // Method to select a different customer
  selectCustomer(index: number, phoneno: string) {
    this.selectedCustomerIndex = index;
    this.msg_index = this.phone_list_msg.findIndex((obj: Conversation) => obj.phoneno === phoneno)
    this.currentChatMessages = this.phone_list_msg[this.msg_index].messages;
    this.ngOnInit()
    setTimeout(() => {
      this.scrollToTop();
    }, 100);
  }
  replacePercentWithSpace(originalString: string): string {
    return originalString.replace(/%/g, ' ');
  }
  sendmessage(msg: string, conversationIndex: number) {
    if (this.messageData != '') {
      let megdata: Message = {
        type: 'outgoing',
        text: msg,
        time: this.formatTime(new Date()),
        date: this.formatTime(new Date())
      }
      let sendmsg: sendmessage = {
        scode: this.scode,
        toPhoneNumber: this.phone_list_msg[conversationIndex].phoneno,
        messageContent: msg
      }
      this.phone_list_msg[conversationIndex].messages.push(megdata)
      console.log(this.phone_list_msg[conversationIndex])
      this.messageData = ''
      setTimeout(() => {
        this.scrollToTop();
        // this.scrollToBottom()
        this.sendmessageapi(sendmsg)
      }, 100);
    }
    else {
      this.toster.error('Please type your message')
    }

  }
  private formatDate(date: Date): string {
    // Format the date as "YYYY-MM-DD" (required by input type="date")
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
  }
  private unixToDateTime(unixTimestamp: number): Date {
    return new Date(unixTimestamp * 1000); // JavaScript Date constructor expects milliseconds
  }
  dateTimeToUnix(date: Date): number {
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
  }
  private scrollToTop(): void {
    try {
      const msgHistory = this.elementRef.nativeElement.querySelector('.chat-body.chat-page-group.slimscroll');
      // msgHistory.scrollTop = 0; // Set scrollTop to 0 to scroll to the top
      msgHistory.scrollTop = msgHistory.scrollHeight; // Set scrollTop to 0 to scroll to the top
    } catch (err) {
      console.error('Error scrolling to top:', err);
    }
  }
  // Function to scroll the chat to the bottom
  private sendmessageapi(msg: sendmessage) {
    this.sendmessageservice.sendmessage(msg).subscribe({
      next: data => {
        // console.log(data)
        console.log('messgae send successfully')
        this.webhookcreateapi({
          apino: this.bussinessid,
          cname: this.phone_list_msg[this.msg_index].cname,
          phone: msg.toPhoneNumber,
          waid: this.phoneid,
          msgs: msg.messageContent
        })
      },
      error: err => {
        console.error(err.message)
      }
    })
  }
  private webhookcreateapi(webhook: Webhookcreate) {
    this.webhook.createwook(webhook).subscribe({
      next: data => {
        console.log('webhook created success fully')
        this.ngOnInit()
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
