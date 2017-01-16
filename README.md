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
| [![Build1][1]][4] | [![Build2][2]][4] | [![Build3][3]][4] |

[1]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/1
[2]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/2
[3]: https://appveyor-matrix-badges.herokuapp.com/repos/tzachshabtay/MonoAGS/branch/master/3
[4]: https://ci.appveyor.com/project/tzachshabtay/monoags
