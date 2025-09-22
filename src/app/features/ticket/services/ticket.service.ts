import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { TicketRow } from '../models/ticket-row';
import { Observable } from 'rxjs/internal/Observable';
import { TicketComment } from '../models/ticket-comment';
import { TicketDetails } from '../models/ticket-details';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
BASE_URL: string = ''

  constructor(private httpClient: HttpClient, private userService: UserService) { 
    this.BASE_URL = userService.getBaseURL()
  }

  syncToGcp() {
    return this.httpClient.get<void>(`${this.BASE_URL}/gcp/sync`, {headers: this.userService.getAuthorizationHeader()});
  }

  fetchTickets() : Observable<TicketRow []>{ 
    return this.httpClient.get<TicketRow []>(`${this.BASE_URL}/api/tickets/fetch`, {headers: this.userService.getAuthorizationHeader()});
  }

  createTicket(category: string, subCategory: string, topic: string, priority: string, description: string) : Observable<void>{
    return this.httpClient.post<void>(`${this.BASE_URL}/api/tickets/submit`, 
    {
      category: category,
      subCategory: subCategory,
      topic: topic,
      priority: priority,
      description: description
    },
    {headers: this.userService.getAuthorizationHeader()});
  }

  getTicketDetails(ticketId: string) : Observable<TicketDetails>{
    return this.httpClient.get<TicketDetails>(`${this.BASE_URL}/api/tickets/${ticketId}/details`, 
    {headers: this.userService.getAuthorizationHeader()});
  }

  logout() {
    this.userService.removeToken()
  }

}
