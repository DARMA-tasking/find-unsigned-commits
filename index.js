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

        const isNotVerified = (data) =>
          data.commit.verification.verified === false;
        const notVerifiedCommits = result.data.filter(isNotVerified);
        if (notVerifiedCommits.length > 0) {
          let failMsg = "Found unsigned commits:";
          notVerifiedCommits.forEach((commit) => {
            failMsg += `\n${commit.sha.substring(0, 7)}`;
          });

          core.setFailed(failMsg);
          return;
        }

        core.info("  - OK");
        return;
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
