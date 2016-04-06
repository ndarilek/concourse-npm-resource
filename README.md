# Concourse NPM Resource

Publishes [NPM](https://npmjs.com) packages.

## Resource Configuration

```yaml
resource_types:

- name: npm
  type: docker-image
  source:
    repository: nolan/concourse-npm-resource
```

## Source Configuration

* `token`: *Required.* The NPM access token found in your .npmrc.

Look for a line like the following:

```
//registry.npmjs.org/:_authToken=abcde
```

Then copy everything after the `=` to the `token` setting. You must have done `npm login` first.

### Example

```yaml
resources:
- name: package
  type: npm
  source:
    username: {{npm_token}}
```

## Behavior

### `check`: Not Yet Implemented

In the future, this may monitor a directory containing a package.json for any outdated packages.

### `in`: Not Yet Implemented

In the future, this might perform an `npm install` in a directory containing a package.json.

### `out`: Publish an NPM Package

Publishes a resource containing a `package.json` to NPM.

#### Parameters

* `path`: *Required.* Path to `package.json` to be published.

* `access`: *Optional.* One of either `public` or `restricted`. Determines the access level of the published package.

#### Examples

Publishes `package.json` at `mypackage`. manually trigger each when the upgrade has been independently verified.

```yaml
jobs:
- name: publish
  plan:
  - get: packageRepo
    trigger: true
  - put: npm
    params:
      path: mypackage
```
