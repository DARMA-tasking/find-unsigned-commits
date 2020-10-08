const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

async function check() {
  try {
    const repoOwner = core.getInput("repo_owner");
    const repoName = core.getInput("repo_name");
    const prNumber = core.getInput("pr_number");

    new Octokit({}).pulls
      .listCommits({
        owner: repoOwner,
        repo: repoName,
        pull_number: prNumber,
      })
      .then((result) => {
        core.info("Checking if all commits are signed");
        const isVerified = (data) => data.commit.verification.verified === true;
        if (result.data.every(isVerified) === true) {
          core.info("  - OK");
          return;
        }

        core.setFailed("Not all commits are signed");
      })
      .catch((error) =>
        core.setFailed(`Error when fetching PR's commits:\n${error}`)
      );
  } catch (error) {
    core.error(error);
    throw error;
  }
}

(async () => {
  try {
    await check();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
