export class CommitDetails
{
    constructor(public commit: Commit) { }
}

class Author
{
    constructor(public name: string, public email: string, public date: Date){}
}

class Commit
{
    constructor(public author: Author, public committer: Author, public message: string, comment_count: number) { }
}