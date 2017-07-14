import { GitHubDashboardPage } from './app.po';

describe('git-hub-dashboard App', () => {
  let page: GitHubDashboardPage;

  beforeEach(() => {
    page = new GitHubDashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
