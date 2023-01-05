import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {FbAuthResponse} from "../../../../environments/interface";

@Injectable({providedIn:'root'})

export class AuthService {

  public error$ : Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  get token(): string {
    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logOut();
      return null!;
    }
    return localStorage.getItem('fb-token')!;
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logOut() {
    this.setToken(null);
  }

  isAuthentificated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.error.error.message) {
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password')
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Such email doesnt exist');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null | any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
