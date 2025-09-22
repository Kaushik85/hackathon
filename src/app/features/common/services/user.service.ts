import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationDetails } from '../../register/models/registration-details';
import { Observable } from 'rxjs';
import { AuthenticationDetails } from '../../login/models/authentication-details';
import { AuthenticationResponse } from '../../login/models/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = "http://localhost:8080";

  token: string | any
  loggedInUser: string | any
  role: string | any

  constructor(private httpClient: HttpClient) { }

  registerUser(registrationDetails: RegistrationDetails) {
    return this.httpClient.post(`${this.BASE_URL}/register`, registrationDetails);
  }

  loginUser(authenticationDetails: AuthenticationDetails) : Observable<AuthenticationResponse>{
     return this.httpClient.post<AuthenticationResponse>(`${this.BASE_URL}/authenticate`, authenticationDetails)
  }

  verifyUser(token: string) {
    return this.httpClient.get<void>(`${this.BASE_URL}/verify/${token}`)
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("token", token)
  }

  removeToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    localStorage.removeItem("role")
    this.token = null
    this.loggedInUser = null
    this.role = null
  }

  getBaseURL(): string {
    return this.BASE_URL;
  }

  getAuthorizationHeader(): HttpHeaders {
    if (!this.token) {
      this.token = localStorage.getItem("token")
    }

    const bearerToken = 'Bearer ' + this.token
    return new HttpHeaders({'Authorization': bearerToken})
  }

  setLoggedInUser(loggedInUser: string, role: string) {
    this.loggedInUser = loggedInUser
    this.role = role
    localStorage.setItem("loggedInUser", loggedInUser)
    localStorage.setItem("role", role)
  }

  getLoggedInUser() : string {
    if (!this.loggedInUser) {
      this.loggedInUser = localStorage.getItem("loggedInUser")
    }
    
    return this.loggedInUser
  }

  getRole() : string {
    if (!this.role) {
      this.role = localStorage.getItem("role")
    }
    
    return this.role
  }
}
