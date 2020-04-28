const { DeploymentBuilder } = require('@xdn/core/deploy')
const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

builder.clearPreviousBuildOutput()
builder.build()
