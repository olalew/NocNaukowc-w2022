import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpClientService {

    constructor(private http: HttpClient) { }

    public request(method: string, url: string, requestObj: any): Observable<any> | undefined {
        return this.chooseMethod(method, url, requestObj);
    }

    private chooseMethod(method: string, url: string, requestObj: any): Observable<any> | undefined {
        switch (method) {
            case 'post':
                return this.post(url, requestObj);
            case 'get':
                return this.get(url);
            case 'delete':
                return this.delete(url);
        }
        return;
    }

    private get(url: string): Observable<any> {
        return this.http.get(url);
    }

    private post(url: string, obj: any): Observable<any> {
        return this.http.post(url, obj);
    }

    private delete(url: string): Observable<any> {
        return this.http.delete(url);
    }
}
