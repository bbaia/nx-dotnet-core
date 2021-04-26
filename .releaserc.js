const srcPackagePath = 'packages/nx-dotnet-core';
const npmPackagePath = 'dist/packages/nx-dotnet-core';

module.exports = {
  branches: ['master', { name: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: [
          `cp CHANGELOG.md ${npmPackagePath}`,
          `cp README.md ${npmPackagePath}`,
          `cp LICENSE ${npmPackagePath}`,
        ].join(' && '),
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: npmPackagePath,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: `cp ${npmPackagePath}/package.json ${srcPackagePath}`,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', `${srcPackagePath}/package.json`],
        message:
          'chore: release ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        failComment: false,
        releasedLabels: false,
        addReleases: 'top',
      },
    ],
  ],
};
