import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, Message } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { TicketRow } from '../../models/ticket-row';
import { TabMenuModule } from 'primeng/tabmenu';
import { TicketComment } from '../../models/ticket-comment';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [TabMenuModule, MenubarModule, FormsModule, InputIconModule, IconFieldModule, TooltipModule, DialogModule, CardModule, TableModule, CommonModule, ButtonModule, MessagesModule, RouterLink, RouterOutlet],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class TicketComponent implements OnInit {
  searchTerm: string = ''
  messages: Message[] | any;
  ticketRows: TicketRow[] = []
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  comments: TicketComment[] = []
  
  token: string | any
  refreshInProgress: boolean = false

  createTicketDialogVisible: boolean = false
  viewDialogeVisible: boolean = false
  userProvidedCategory: string = ''
  userProvidedSubCategory: string = ''
  userProvidedTopic: string = ''
  userProvidedPriority: string = ''
  userProvidedDescription: string = ''
  userProvidedComment: string = ''
  activeTicketId: string = ''

  activeDescription: string = ''

  constructor(private route: ActivatedRoute, private ticketService: TicketService, private router: Router) {

  }

  ngOnInit(): void {
    this.items = [
        {
          label: 'My Tickets',
          icon: 'pi pi-home'
        },
        {
          label: 'Logout',
          icon: 'pi pi-power-off',
          style: { 'margin-left': 'auto' }
        }
    ]
    this.activeItem = this.items[0];
    this.fetchTickets();
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
    if (event.label === 'Logout') {
      this.ticketService.logout()
      this.router.navigate(['/login']);
    } 
    else if (event.label === 'My Tickets') {
      this.router.navigate(['/tickets']);
    }   
  }

  closeDiv() {
    this.createTicketDialogVisible = false
  }

  private fetchTickets() {
    this.refreshInProgress = true
    this.ticketService.fetchTickets()
      .subscribe({
        next: (tickets: TicketRow[]) => {
          this.refreshInProgress = false
          this.ticketRows = tickets
        },
        error: (error) => {
          this.refreshInProgress = false
          console.error('Error fetching tickets:', error);
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Forbidden) {
            this.router.navigate(['/login'])
          }
          else {
            this.messages = [{ severity: 'error', detail: error.error?.message || 'Failed to fetch tickets.' }];
          }
        }
      });
  }

  refreshNow() {
    this.fetchTickets()
  }

  viewDetails (ticketId: string) {
    this.activeTicketId = ticketId
    this.ticketService.getTicketDetails(ticketId)
      .subscribe({
        next: (ticketDetails) => {
          console.log('Fetched comments:', ticketDetails);     
          this.activeDescription = ticketDetails.description
          console.log('Fetched description:', this.activeDescription);
          this.comments = ticketDetails.comments
          this.viewDialogeVisible = true
        },      
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Forbidden) {
            this.router.navigate(['/login'])
          }
          else {
            this.messages = [{ severity: 'error', detail: error.error?.message || 'Failed to fetch ticket details.' }];
          }
        }
      });   

  }

  openTicketForm() {
    this.createTicketDialogVisible = true
  }

  syncGcp() {
    this.ticketService.syncToGcp()
      .subscribe({
        next: () => {     
          this.messages = [{ severity: 'success', detail: 'GCP sync initiated.' }];
        },      
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Forbidden) {
            this.router.navigate(['/login'])
          }
          else {
            this.messages = [{ severity: 'error', detail: 'Failed to create ticket.' }];
          }
        }
      });   

        
  }

  submit() {
    if (!this.userProvidedCategory || !this.userProvidedSubCategory || !this.userProvidedTopic || !this.userProvidedPriority || !this.userProvidedDescription) {
      this.messages = [{ severity: 'error', detail: 'Please fill in all fields.' }];
      return;
    }
    this.ticketService.createTicket(this.userProvidedCategory, this.userProvidedSubCategory, this.userProvidedTopic, this.userProvidedPriority, this.userProvidedDescription)
      .subscribe({
        next: (response) => {
          this.createTicketDialogVisible = false
          this.messages = [{ severity: 'success', detail: 'Ticket created.' }];
          this.fetchTickets()
          this.userProvidedCategory = ''
          this.userProvidedSubCategory = ''
          this.userProvidedTopic = ''
          this.userProvidedPriority = ''
          this.userProvidedDescription = ''
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Forbidden) {
            this.router.navigate(['/login'])
          }
          else {
            this.messages = [{ severity: 'error', detail: 'Failed to create ticket.' }];
          }
        }
      });
  }

  submitComment() {
    this.ticketService.submitComment(this.activeTicketId, this.userProvidedComment)
      .subscribe({
        next: (response) => {
          this.viewDialogeVisible = false
          this.activeTicketId = ''
          this.userProvidedComment = ''
          this.messages = [{ severity: 'success', detail: 'Comment submitted.' }];
        },
        error: (error) => {
          this.viewDialogeVisible = false
          this.activeTicketId = ''
          this.userProvidedComment = ''
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Forbidden) {
            this.router.navigate(['/login'])
          }
          else {
            this.messages = [{ severity: 'error', detail: error.error?.message || 'Failed to submit comment.' }];
          }
        }
      });
  }
}
