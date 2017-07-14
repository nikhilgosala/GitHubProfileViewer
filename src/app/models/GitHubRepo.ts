export class GitHubRepo
{
    constructor(public name: string,
        public url: string,
        public description: string,
        public tags_url: string,
        public commits_url: string,
        public language: string,
        public forks_count: string,
        public git_url: string,
        public clone_url: string,
        public created_at: Date,
        public updated_at: Date,
        public pushed_at: Date) {}
}