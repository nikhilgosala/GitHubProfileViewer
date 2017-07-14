export class GitHubProfile {
    constructor(public login: string,
        public avatar_url: string,
        public html_url: string,
        public name: string,
        public location: string,
        public public_repos: string,
        public followers: string,
        public created_at: Date,
        public updated_at: Date,
        public error: string) { }
}