import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationDetails } from '../../models/authentication-details';
import { UserService } from '../../../common/services/user.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MessagesModule, CardModule, ButtonModule, CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  messages: Message[] | any;
  email: string | any
  password: string | any
  authenticationDetails: AuthenticationDetails = new AuthenticationDetails()


  constructor(
    private router: Router, private userService: UserService
  ) {

  }

  ngOnInit(): void {
    // Add event listener to handle Enter key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.login();
      }
    });
  }

  isValidInput(): boolean {
    if (!this.email || !this.password) {
      return false;
    }

    return isValidEmail(this.email);
  }


  login() {
    if (!this.isValidInput()) {
      this.messages = [{ severity: 'error', detail: 'Please enter valid values.' }];
      return
    }

    this.authenticationDetails.email = this.email
    this.authenticationDetails.password = this.password

    this.userService.loginUser(this.authenticationDetails)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.userService.setToken(response.token)
          this.userService.setLoggedInUser(this.authenticationDetails.email, response.role)
          this.router.navigate(['/tickets'])
        },
        error: () => {
          this.messages = [{ severity: 'error', detail: 'Login failed.' }];
        }

      })

  }
}