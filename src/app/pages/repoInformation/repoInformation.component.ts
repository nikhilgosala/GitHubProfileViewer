import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../../services/dataService';
import { GitHubProfile } from '../../models/GitHubProfile';
import { GitHubRepo } from '../../models/GitHubRepo';
import { CommitDetails } from '../../models/CommitDetails';

@Component({
    selector: 'app-repo-information',
    templateUrl: './repoInformation.component.html',
    styleUrls: ['./repoInformation.component.css'],
    providers: [DataService]
})

export class RepoInformationComponent implements OnInit {
    private repoUrl: string;
    private userName: string;

    private gitHubProfile: GitHubProfile;    
    private repositoryDetails: GitHubRepo;
    private commitDetails: CommitDetails[];
    private isDataAvailable: boolean = false;
    private isRepositoryDetailsAvailable: boolean = false;
    private isCommitDetailsAvailable: boolean = false;
    private searchFilter: string = '';

    private filteredCommitDetails: CommitDetails[];

    private currentPageNumber: number;
    private currentPageStartIndex: number;
    private totalPages: number;
    private startingPageNumberInPaginationBar: number;
    private pageNumbersInPaginationBar: number[];
    private numberOfPagesInPaginationBar: number;
    private currentPageItems: CommitDetails[];
    private MAX_ENTRIES_PER_PAGE: number = 5;
    private MAX_PAGES_IN_PAGINATION_BAR: number = 5;

    private commitsInMonth: Map<string, number> = new Map<string, number>();
    private barChartLabels: string[];
    private barChartData: Array<Number[]> = new Array<Number[]>();
    private barChartType: string = 'bar';
    private barChartLegend: boolean = false;
    private barChartOptions: any = { title: { display: true, text: 'Commits / Month' }, scaleShowVerticalLines: true, reponsive: true, scales: {yAxes: [{ticks: {beginAtZero: true}}]} };
    
    constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) {}    
    
    ngOnInit()
    {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userName = params['userName'];
            this.repoUrl = params['repoUrl'];
            this.getGitHubProfileDetails();
            this.getRepositoryDetails();
            this.getRepositoryCommitDetails();
        });
    } 

    getGitHubProfileDetails() {
        this.dataService.getGitHubProfileDetails(this.userName)
            .then(gitHubProfile => {
                this.gitHubProfile = gitHubProfile;
                this.isDataAvailable = true;
            })
        
    }
    
    getRepositoryDetails()
    {
        this.dataService.getRepositoryDetails(this.repoUrl).
            then(repositoryDetails => {
                this.repositoryDetails = repositoryDetails;
                this.isRepositoryDetailsAvailable = true;
            });
    }

    getRepositoryCommitDetails() {
        this.dataService.getRepositoryCommitDetails(this.repoUrl).
            then(commitDetails => {
                this.commitDetails = commitDetails;
                this.filteredCommitDetails = this.commitDetails;
                this.isCommitDetailsAvailable = true;
                this.init();
                this.populateChart();
            });
    }

    refreshItems()
    {
        this.currentPageItems = this.filteredCommitDetails.slice((this.currentPageNumber - 1) * this.MAX_ENTRIES_PER_PAGE, (this.currentPageNumber) * this.MAX_ENTRIES_PER_PAGE);
        this.pageNumbersInPaginationBar = this.fillPaginationBar();
    }

    init()
    {
        this.startingPageNumberInPaginationBar = 1;
        this.totalPages = parseInt("" + (this.filteredCommitDetails.length / this.MAX_ENTRIES_PER_PAGE));
        this.currentPageNumber = 1;
        if (this.filteredCommitDetails.length % this.MAX_ENTRIES_PER_PAGE !== 0) this.totalPages += 1;
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
        this.filteredCommitDetails = [];
        if (this.searchFilter === '')
        {
            this.filteredCommitDetails = this.commitDetails;
        }
        else
        {
            this.commitDetails.forEach(element => {
                let condition: boolean =
                    (element.commit.author.name !== null && element.commit.author.name.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.commit.author.email !== null && element.commit.author.email.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.commit.committer.name !== null && element.commit.committer.name.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.commit.committer.email !== null && element.commit.committer.email.toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.commit.committer.date !== null && element.commit.committer.date.toString().toLowerCase().search(this.searchFilter) !== -1) ||
                    (element.commit.message !== null && element.commit.message.toLowerCase().search(this.searchFilter) !== -1);
            
                if (condition) {
                    this.filteredCommitDetails.push(element);
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

    populateChart()
    {
        this.commitDetails.forEach(element => {
            var dateString = element.commit.author.date.toString().split('-');
            var month = dateString[0] + '-' + dateString[1];
            if (this.commitsInMonth.has(month))
            {
                var currentNumber = this.commitsInMonth.get(month);
                this.commitsInMonth.set(month, currentNumber + 1);
            } 
            else
            {
                this.commitsInMonth.set(month, 1);
            }
        });

        this.barChartLabels = Array.from(this.commitsInMonth.keys());
        this.barChartData.push(Array.from(this.commitsInMonth.values()));
    }
}