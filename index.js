// Local-directory plugin entrypoint: OpenCode resolves configured directory
// targets to <dir>/index.js (package.json "main" is only honored for package
// installs), so re-export the built bundle from the package root.
export { default } from './dist/index.js'
