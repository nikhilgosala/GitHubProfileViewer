import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../../services/dataService';
import { GitHubProfile } from '../../models/GitHubProfile';
import { GitHubRepo } from '../../models/GitHubRepo';

@Component({
    selector: 'app-profile-information',
    templateUrl: './profileInformation.component.html',
    styleUrls: ['./profileInformation.component.css'],
    providers: [DataService]
})

export class ProfileInformationComponent implements OnInit {
    private userName: string;
    private gitHubProfile: GitHubProfile;
    private repositoryDetails: GitHubRepo[] = [];
    private isDataAvailable: boolean = false;
    private isRepoDataAvailable: boolean = false;
    private isFilteredRepoDataAvailable: boolean = false;
    private searchFilter: string = '';

    private filteredRepositoryDetails: GitHubRepo[];

    private currentPageNumber: number;
    private currentPageStartIndex: number;
    private totalPages: number;
    private startingPageNumberInPaginationBar: number;
    private pageNumbersInPaginationBar: number[];
    private numberOfPagesInPaginationBar: number;
    private currentPageItems: GitHubRepo[];
    private MAX_ENTRIES_PER_PAGE: number = 5;
    private MAX_PAGES_IN_PAGINATION_BAR: number = 5;

    constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private router: Router) {
    }
    
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userName = params['userName'];
            this.getGitHubProfileDetails();
            this.getRepositoryDetails();          
        });
    }

    getGitHubProfileDetails() {
        this.dataService.getGitHubProfileDetails(this.userName)
            .then(gitHubProfile => {
                this.gitHubProfile = gitHubProfile;
                this.isDataAvailable = true;
            })
        
    }

    getRepositoryDetails() {
        this.dataService.getUserRepositoryDetails(this.userName)
            .then(repositoryDetails => {
                this.repositoryDetails = repositoryDetails;
                this.filteredRepositoryDetails = repositoryDetails;
                this.isRepoDataAvailable = true;
                this.isFilteredRepoDataAvailable = true;
                this.init();
            })
    }

    refreshItems()
    {
        this.currentPageItems = this.filteredRepositoryDetails.slice((this.currentPageNumber - 1) * this.MAX_ENTRIES_PER_PAGE, (this.currentPageNumber) * this.MAX_ENTRIES_PER_PAGE);
        this.pageNumbersInPaginationBar = this.fillPaginationBar();
    }

    init()
    {
        this.currentPageNumber = 1;
        this.startingPageNumberInPaginationBar = 1;
        this.totalPages = parseInt("" + (this.filteredRepositoryDetails.length / this.MAX_ENTRIES_PER_PAGE));
        if (this.filteredRepositoryDetails.length % this.MAX_ENTRIES_PER_PAGE !== 0) this.totalPages += 1;
        if (this.totalPages < this.MAX_PAGES_IN_PAGINATION_BAR) this.numberOfPagesInPaginationBar = this.totalPages;
        else this.numberOfPagesInPaginationBar = this.MAX_PAGES_IN_PAGINATION_BAR;
        this.refreshItems();      
    }

    fillPaginationBar()
    {
        let array: Array<number> = new Array<number>();
        for (var index = this.startingPageNumberInPaginationBar; index < this.startingPageNumberInPaginationBar + this.numberOfPagesInPaginationBar; index++)
        {
            array.push(index);
        }
        return array;
    }

    filterRepos()
    {
        this.filteredRepositoryDetails = [];
        if (this.searchFilter === '')
        {
            this.filteredRepositoryDetails = this.repositoryDetails;
        }
        else
        {
            this.repositoryDetails.forEach(element => {
                let condition: boolean =
                    (element.name !== null && element.name.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.language !== null && element.language.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.description !== null && element.description.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.forks_count !== null && element.forks_count.toString().toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.created_at !== null && element.created_at.toString().toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.updated_at !== null && element.updated_at.toString().toLowerCase().search(this.searchFilter) !== -1);
            
                if (condition) {
                    this.filteredRepositoryDetails.push(element);
                }                
            });
        }  
        this.init();
    }

    previousPage() 
    {
        if (this.currentPageNumber > 1) this.currentPageNumber -= 1;
        if (this.currentPageNumber < this.startingPageNumberInPaginationBar) this.startingPageNumberInPaginationBar = this.currentPageNumber;
        this.refreshItems();
    }

    setPage(page: number)
    {
        this.currentPageNumber = page;
        this.refreshItems();
    }

    nextPage()
    {
        if (this.currentPageNumber < this.totalPages) this.currentPageNumber += 1;
        if (this.currentPageNumber >= this.startingPageNumberInPaginationBar + this.numberOfPagesInPaginationBar) this.startingPageNumberInPaginationBar = this.currentPageNumber - this.numberOfPagesInPaginationBar + 1;
        this.refreshItems();
    }

    searchTextChanged(newValue)
    {
        this.searchFilter = newValue.toLowerCase();
        this.filterRepos();
    }

    openRepo(url: string)
    {
        this.router.navigate(['repoInformation'], { queryParams: { userName: this.userName, repoUrl: url }}); 
    }
    


}