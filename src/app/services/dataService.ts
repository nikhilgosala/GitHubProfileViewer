import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { GitHubProfile } from '../models/GitHubProfile';
import { GitHubRepo } from '../models/GitHubRepo';
import { CommitDetails } from '../models/CommitDetails';

@Injectable()
export class DataService {

    GIT_HUB_USERS_URL: string = 'https://api.github.com/users/'
    headers: Headers = new Headers();

    constructor(private http: Http) { 
        this.headers.append('Accept', 'application/vnd.github.v3+json');
    }
    
    public getGitHubProfileDetails(profileName: string): Promise<GitHubProfile> {
        return this.http.get(this.GIT_HUB_USERS_URL + profileName, {headers: this.headers}).
            map((response: Response) => response.json()).toPromise().
            catch((error: any) => Observable.throw(error.json().error || 'Error fetching user details'));
    }

    public getUserRepositoryDetails(profileName: string): Promise<GitHubRepo[]> {
        return this.http.get(this.GIT_HUB_USERS_URL + profileName + '/repos', { headers: this.headers }).
            map((response: Response) => response.json()).toPromise().
            catch((error: any) => Observable.throw(error.json().error || 'Error fetching user repositories'));
    }

    public getRepositoryDetails(url: string): Promise<GitHubRepo> {
        return this.http.get(url, { headers: this.headers }).
            map((response: Response) => response.json()).toPromise().
            catch((error: any) => Observable.throw(error.json().error || 'Error fetching repository details'));
    }

    public getRepositoryCommitDetails(url: string): Promise<CommitDetails[]> {
        return this.http.get(url + '/commits', { headers: this.headers }).
            map((response: Response) => response.json()).toPromise().
            catch((error: any) => Observable.throw(error.json().error || 'Error fetching repository commit details'));
    }
}