module.exports = {
  extends: ['@commitlint/config-conventional'],
  'header-max-length': [2, 'always', 100],
  "header-min-length": [2, "always", 12],
  "type-enum": [
    2,
    "always",
    [
      "build",
      "chore",
      "ci",
      "docs",
      "feat",
      "fix",
      'enhance',
      "perf",
      "refactor",
      "revert",
      "style",
      "test",
    ]
  ]
}
