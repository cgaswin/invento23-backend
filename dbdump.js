const util = require("util")
const path = require("path")

const exec = util.promisify(require("child_process").exec)
require("dotenv").config()

async function dumpDb(dbName) {
  const dbUri = process.env.DB_URI_PROD

  console.info("Starting dump.....")
  console.log("DB_URI: ", dbUri)

  if (!dbUri) {
    console.error("DB_URI environment variable not set")
    return
  }

  if (!dbName) {
    console.error("Missing dbName ")
    return
  }

  const cmd = `mongodump --uri="${dbUri}" --db="${dbName}"`

  console.log(`Running command: ${cmd}`)

  try {
    const { stdout, stderr } = await exec(cmd)
    console.log(stdout)
    console.error(stderr)
    return
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function restoreDb(dbName) {
  const dbUri = process.env.DB_URI_DEV

  if (!dbUri) {
    console.error("DB_URI environment variable not set")
    return
  }

  if (!dbName) {
    console.error("Missing dbName")
    return
  }
  console.info("Starting restore.....")

  // flush existing data
  const flushCmd = `mongosh "${dbUri}" --eval "use ${dbName}" --eval "db.dropDatabase()"`
  console.log(`Running command: ${flushCmd}`)
  try {
    const { stdout, stderr } = await exec(flushCmd)
    console.log(stdout)
    console.error(stderr)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  const cmd = `mongorestore`

  console.log(`Running command: ${cmd}`)
  try {
    const { stdout, stderr } = await exec(cmd)
    console.log(stdout)
    console.error(stderr)
    return
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function dumpAndRestoreDb(dbName) {
  await dumpDb(dbName).then(() => {
    restoreDb(dbName)
  })
}

dumpAndRestoreDb("inventoDB")
