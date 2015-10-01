/* eslint-env mocha */

var assert = require('assert')
var path = require('path')

var ENVIRONMENT = require('../../../dist/util/environment.js')
var getMeteorMeta = require('../../../dist/util/getMeteorMeta.js')


const rootPath = path.join('User', 'anon', 'meteor-project')
const rootPaths = [rootPath]

describe('getMeteorMeta', function () {

  it('does not accept anything that is not an array', function () {
    assert.throws(getMeteorMeta.bind(null), Error)
    assert.throws(getMeteorMeta.bind(null, {}), Error)
    assert.throws(getMeteorMeta.bind(null, true), Error)
    assert.throws(getMeteorMeta.bind(null, false), Error)
    assert.throws(getMeteorMeta.bind(null, 2), Error)
  })

  describe('when not in Meteor project', function () {
    it('returns default env', function () {
      var result = getMeteorMeta([], 'file.js')
      assert.equal(typeof result, 'object')
      assert.equal(result.isInMeteorProject, false)
      assert.equal(Object.keys(result).length, 1)
    })
  })

  describe('in public', function () {
    it('detects the environment', function () {
      var filename = path.join(rootPath, 'public', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'public/file.js')
      assert.equal(result.env, ENVIRONMENT.PUBLIC)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })
  })

  describe('in private', function () {
    it('detects the environment', function () {
      var filename = path.join(rootPath, 'private', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'private/file.js')
      assert.equal(result.env, ENVIRONMENT.PRIVATE)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })
  })

  describe('in package', function () {
    it('detects the environment', function () {
      var filename = path.join(rootPath, 'packages', 'awesome-pkg', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'packages/awesome-pkg/file.js')
      assert.equal(result.env, ENVIRONMENT.PACKAGE)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })
  })

  describe('on no special folder', function () {
    it('has universal environment', function () {
      var filename = path.join(rootPath, 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'file.js')
      assert.equal(result.env, ENVIRONMENT.UNIVERSAL)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })
  })

  describe('on client', function () {

    it('returns file info', function () {
      var filename = path.join(rootPath, 'client', 'lib', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'client/lib/file.js')
      assert.equal(result.env, ENVIRONMENT.CLIENT)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })

    it('does not detect compatibility when directly in client-folder ', function () {
      var filename = path.join(rootPath, 'client', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'client/file.js')
      assert.equal(result.env, ENVIRONMENT.CLIENT)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })

    it('detects compatibility mode', function () {
      var filename = path.join(rootPath, 'client', 'compatibility', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'client/compatibility/file.js')
      assert.equal(result.env, ENVIRONMENT.CLIENT)
      assert.equal(result.isCompatibilityFile, true)
      assert.equal(result.isInMeteorProject, true)
    })
  })

  describe('on server', function () {
    it('detects the environment', function () {
      var filename = path.join(rootPath, 'server', 'file.js')
      var result = getMeteorMeta(rootPaths, filename)
      assert.equal(typeof result, 'object')
      assert.equal(result.path, 'server/file.js')
      assert.equal(result.env, ENVIRONMENT.SERVER)
      assert.equal(result.isCompatibilityFile, false)
      assert.equal(result.isInMeteorProject, true)
    })

    describe('that is nested', function () {
      it('detects the environment', function () {
        var filename = path.join(rootPath, 'lib', 'server', 'file.js')
        var result = getMeteorMeta(rootPaths, filename)
        assert.equal(typeof result, 'object')
        assert.equal(result.path, 'lib/server/file.js')
        assert.equal(result.env, ENVIRONMENT.SERVER)
        assert.equal(result.isCompatibilityFile, false)
        assert.equal(result.isInMeteorProject, true)
      })
    })
  })

  describe('in tests', function () {
    var filename = path.join(rootPath, 'tests', 'file.js')
    var result = getMeteorMeta(rootPaths, filename)
    assert.equal(typeof result, 'object')
    assert.equal(result.path, 'tests/file.js')
    assert.equal(result.env, ENVIRONMENT.TEST)
    assert.equal(result.isCompatibilityFile, false)
    assert.equal(result.isInMeteorProject, true)
  })

  describe('in node_modules', function () {
    var filename = path.join(rootPath, 'node_modules', 'my-module', 'file.js')
    var result = getMeteorMeta(rootPaths, filename)
    assert.equal(typeof result, 'object')
    assert.equal(result.path, 'node_modules/my-module/file.js')
    assert.equal(result.env, ENVIRONMENT.NODE_MODULE)
    assert.equal(result.isCompatibilityFile, false)
    assert.equal(result.isInMeteorProject, true)
  })

  describe('mobile-config.js', function () {
    it('is detected', function () {
      var filename = path.join(rootPath, 'mobile-config.js')
      var result = getMeteorMeta(rootPaths, filename)

      assert.equal(result.isMobileConfig, true)
    })

    it('is not detected', function () {
      var filename = path.join(rootPath, 'sub', 'mobile-config.js')
      var result = getMeteorMeta(rootPaths, filename)

      assert.equal(result.isMobileConfig, false)
    })
  })

  describe('package.js', function () {
    it('is detected', function () {
      var filename = path.join(rootPath, 'packages', 'my-module', 'package.js')
      var result = getMeteorMeta(rootPaths, filename)

      assert.equal(result.isPackageConfig, true)
    })

    it('is not detected', function () {
      var filename = path.join(rootPath, 'packages', 'package.js')
      var result = getMeteorMeta(rootPaths, filename)

      assert.equal(result.isPackageConfig, false)
    })
  })


})
