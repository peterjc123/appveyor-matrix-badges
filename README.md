# Appveyor Matrix Build Badges

A small web server to produce a badge per job in an Appveyor build.
Note: inspired by Travis-matrix-badges (https://github.com/bjfish/travis-matrix-badges) which provides similar functionality for Travis builds.

## URL Format

Replace the following parameters
```
https://appveyor-matrix-badges.herokuapp.com/repos/{accountName}/{projectSlug}/branch/{buildBranch}/{jobNumber}
```

### Live Example

| Build1            | Build2            | Build3            |
|-------------------|-------------------|-------------------|
| [![build1][]][build-link] | [![build2][]][build-link] | [![build3][]][build-link] |

[build1]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/1
[build2]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/2
[build3]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/3
[build-link]: https://ci.appveyor.com/project/tzachshabtay/monoags
