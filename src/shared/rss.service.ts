import { ArchiveFeed } from '../model/archive-feed';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Feed } from '../model/feed';
import * as xml2js from "xml2js"


@Injectable()
export class RssService {

    private baseUrl = "https://rss2json.com/api.json?rss_url=";
    constructor(private http: Http) {
    }

    getFeedContent(url: string): Observable<Feed> {
        return this.http.get(this.baseUrl + url)
            .map(this.extractFeeds)
            .catch(this.handleError);
    }

    getaArchiveFeed(url: string): Observable<any> {
        let username = "caevan@gmail.com";
        let password = "sachinwalla";
        let searchParams = new URLSearchParams();
        let headers = new Headers();

        searchParams.append('username', username);
        searchParams.append('password', password);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(url, searchParams, headers)
            .map(this.handleArchiveFeedsXml)
            .catch(this.handleError);
    }

    handleArchiveFeedsXml(res: Response): Array<ArchiveFeed> {
        let xml: string = res["_body"];
        let resultFeeds: any  = [];

        if (xml == 'fail') {
            return [];
        }

        xml2js.parseString(xml, function (err, result) {
            if (!err) {
                if (result.rss) {
                     resultFeeds = result.rss.channel[0].item;
                }
            }
        });

        return resultFeeds;
    }

    private extractFeeds(res: Response): Feed {
        let feed = res.json();
        return feed || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = "";
        if(error.message){
            errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log t o console instead
        }
        else{
            console.log('Error encountered', error);
        }
        return Observable.throw(errMsg);
    }
}