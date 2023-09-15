// exec wrapper

import colors             from "colors/safe.js"
import { promisify }      from "util"
import { exec as execCb } from "child_process"

const exec = promisify(execCb)


async function execWrapper(cmd) {
  console.log(colors.cyan(cmd))
  try {
    const { stdout } = await exec(cmd)
    console.log(colors.gray(stdout))
    return stdout
  } catch (error) {
    console.error(colors.bgRed("STDERR:"), error.stderr)
    return error.stderr
  }
}


/*
await execWrapper("pwd")
await execWrapper("mkdir toto")
await execWrapper("ls -l")
await execWrapper("cd toto")
await execWrapper("pwd")
await execWrapper("mkdir titi")
await execWrapper("ls -l")
await execWrapper("pwd")
*/

export default execWrapper
