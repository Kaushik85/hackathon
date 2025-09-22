import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationDetails } from '../../models/registration-details';
import { UserService } from '../../../common/services/user.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MessagesModule, FormsModule, CardModule, ButtonModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  verificationInProgress: boolean = false
  fullName: string | any
  email: string | any
  password: string | any
  confirmPassword: string | any
  messages: Message[] | any;
  registrationDetails: RegistrationDetails = new RegistrationDetails()

  constructor(private router: Router, private userService: UserService) {

  }

  ngOnInit(): void {
    // Add event listener to handle Enter key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.register();
      }
    });
  }

  isValidInput(): boolean {
    // Basic input validation
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.messages = [{ severity: 'error', detail: 'Please fill in all fields.' }];
      return false;
    }

    if (!isValidEmail(this.email)) {
      this.messages = [{ severity: 'error', detail: 'Please eneter a valid email ID.' }];
      return false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.messages = [{ severity: 'error', detail: 'Password must be at least 8 characters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character (@ $ ! % * ? &)' }];
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.messages = [{ severity: 'error', detail: 'Passwords do not match.' }];

      return false;
    }

    if (this.password === 'Abcd$1234') {
      this.messages = [{ severity: 'error', detail: 'Do not use the example password.' }];

      return false;
    }

    return true;
  }

  register() {
    if (!this.isValidInput()) {
      return
    }

    this.registrationDetails.fullName = this.fullName
    this.registrationDetails.email = this.email
    this.registrationDetails.password = this.password

    this.userService.registerUser(this.registrationDetails)
      .subscribe({
        next: () => {
          this.router.navigate(['/login'])
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.BadRequest) {
            this.messages = [{ severity: 'error', detail: 'User already exists.' }];
          }
          else {
            this.messages = [{ severity: 'error', detail: 'User registration failed. Please contact support.' }];
          }
        }

      })
  }

}