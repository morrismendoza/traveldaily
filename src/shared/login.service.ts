import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LoginService {

    private baseUrl = "http://traveldaily.com.au/tdcontrol/elogin";

    constructor(
        private http: Http) {

    }

    authenticateUser(username: string, password: string) : Observable<any> {
        let cred = {user: username, pass: password};
        let body = JSON.stringify(cred);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Allow-Control-Allow-Origin' : "*" });

        return this.http.post(this.baseUrl, body, headers)
            .map(this.handleLogin)
            .catch(this.handleError);
    }

    private handleLogin(res: Response): any {
        let login = res.json();
        return login || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log t o console instead
        return Observable.throw(errMsg);
    }
}