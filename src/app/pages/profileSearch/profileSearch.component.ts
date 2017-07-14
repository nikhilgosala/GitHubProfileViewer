import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataService';


@Component({
    selector: 'app-profile-search',
    templateUrl: './profileSearch.component.html',
    styleUrls: ['./profileSearch.component.css'],
    providers: [DataService]
})

export class ProfileSearchComponent {

    userName: string = '';
    errorMessage: string = '';
    isError: boolean = false;
    
    constructor(private router: Router, private dataService: DataService) {}

    public sendData() {
        if (this.userName === '') {
            this.isError = true;
        }
        else
        {
            this.dataService.getGitHubProfileDetails(this.userName).then(response => {
                if (response.error != null && response.error !== '') this.isError = true;
                else this.isError = false;
                if (!this.isError)
                {
                    this.router.navigate(['profileInformation'], {queryParams: {userName: this.userName}}); 
                }  
                else
                {
                    this.userName = '';
                }
            });
        }    
    }


}