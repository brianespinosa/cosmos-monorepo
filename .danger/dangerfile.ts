import { danger, warn, fail, message } from 'danger';

// Git specific values
const modifiedFiles = danger.git.modified_files;
const newFiles = danger.git.created_files;
const changedFiles = [...modifiedFiles, ...newFiles];

// Github specific values
const github = {
  description: danger.github.pr.body,
  assignee: danger.github.pr.assignee,
};

// Changed file evaluations
const changed = {
  fixtures: modifiedFiles.filter((file) => file.includes('fixture.js')),
  packages: changedFiles.filter((file) => file.includes('package.json')),
  snapshots: modifiedFiles.filter((file) => file.includes('test.snap')),
};

// PR description sections
const descSection = {
  dependencies: '### Dependencies',
  snapshots: '### Snapshots',
};

// Evaluates the description to see if it contains a particular section
const hasDescriptionSection = (section: keyof typeof descSection) =>
  github.description.includes(descSection[section]);

// No PR is too small to include a description of why you made a change
if (github.description.length < 10) {
  warn('Please include a description of your PR changes.');
}

// Check that someone has been assigned to this PR
if (github.assignee === null) {
  warn(
    'Please assign someone to merge this PR, and optionally include people who should review.'
  );
}

// Check if we are modifying any Cosmos fixtures
if (changed.fixtures) {
  for (let file of changed.fixtures) {
    message(`**${file}**: This fixture has been changed.`, file);
  }
}

// Check if we are updating or adding any package dependencies
if (changed.packages && hasDescriptionSection('dependencies')) {
  for (let file of changed.packages) {
    fail(
      `Please provide a comments about why we are changing dependencies. This can be done by adding a '${descSection.dependencies}' section to our PR description.`
    );
  }
}

// Check if we are modifying any Jest snapshots
if (changed.snapshots) {
  for (let file of changed.snapshots) {
    warn(
      `**${file}**: Please provide a reason we are having to change test snapshots.`,
      file
    );
  }
}