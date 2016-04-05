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

* `username`: *Required.* The NPM username.

* `password`: *Required.* The NPM password.

* `email`: *Required.* The NPM email address.

### Example

```yaml
resources:
- name: package
  type: npm
  source:
    username: {{npm_username}}
    password: {{npm_password}}
    email: {{npm_email}}
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
