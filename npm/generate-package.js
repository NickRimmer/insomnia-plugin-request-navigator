/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const npmPackageName = 'insomnia-plugin-tabs'

async function executeAsync() {
  const fs = require('fs')
  const request = require('request')
  const semver = require('semver')

  // build a new clear package.json for NPM + Insomnia
  const dataJson = fs.readFileSync('package.json').toString()
  const dataObj = JSON.parse(dataJson)

  // read version from remote
  const getCurrentVersionAsync = async () => new Promise((resolve, reject) => {
    // use it for the first lunch as the packge is not published yet
    return resolve('0.1.0')

    // eslint-disable-next-line no-unreachable
    request(`https://registry.npmjs.org/-/package/${npmPackageName}/dist-tags`, {
      json: true,
    }, (error, res, body) => {
      if (error || res.statusCode !== 200) reject()
      resolve(body.latest)
    })
  })

  // versions auto builder
  const buildVersionAsync = async (configuredVersion) => {
    const deployedVersion = await getCurrentVersionAsync()

    console.info(`Configured version: ${configuredVersion}`)
    console.info(`Deployed version: ${deployedVersion}`)

    if (semver.gt(configuredVersion, deployedVersion)) {
      console.warn('Will be used configured version as it is greater then deployed')
      return configuredVersion
    }

    const incrementedVersion = semver.inc(deployedVersion, 'patch')
    console.info(`New version generated: ${incrementedVersion}`)
    return incrementedVersion
  }

  const version = await buildVersionAsync(dataObj.version)
  const resultObj = {
    name: dataObj.name,
    version: version,
    main: 'index.js',
    author: dataObj.author,
    license: dataObj.license,
    repository: dataObj.repository,
    bugs: dataObj.bugs,
    insomnia: dataObj.insomnia,
    dependencies: dataObj.dependencies,
  }

  const resultJson = JSON.stringify(resultObj, null, 2)
  if (!fs.existsSync('dist')) fs.mkdirSync('dist')
  fs.writeFileSync('dist/package.json', resultJson)
}

executeAsync()
