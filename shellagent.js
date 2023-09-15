
import { input } from "@inquirer/prompts"
import OpenAI    from "openai"
import colors    from "colors"
import exec      from "./exec.js"
import config    from "./config.js"


let prompt_tokens      = 0
let completaion_tokens = 0


const openai = new OpenAI({
  apiKey: config.openAIkey
})

const messages = [
  //    {"role": "system", "content": "You are a helpful assistant."},
  {"role": "system", "content": `You are a bash shell agent running on MacOS.
    Important: Your answers are made of only ONE shell command.
    Don't apologize. Only anwser with a shell command.
    The reply to your answers will be made of the STDOUT or the STDERR to your command.
    You can use any command available on MacOS and you can install missing commands with brew.
    You can use any shell function, variables, syntax, including pipes, redirections, etc.
    Once you have completed the task, type "done" and wait for new instructions.
    If something goes wrong, don't apologize, just try again with a new shell command.`},
  {"role": "user", "content": `Please do the following tasks step by step:
    - Create 5 sub directories named after common first names in directory 'tata'
    - list them
    - delete all sub directories that are in the 'tata' directory, that have a "a" in their name.
    - list remaining sub directories`},
  {"role": "assistant", "content": "ls"},
  {"role": "user", "content": "shellagent.js       exec.js              node_modules/       package-lock.json    package.json         titi/     toto/"},
  {"role": "assistant", "content": "mkdir tata"},
  {"role": "user", "content": ""},
  {"role": "assistant", "content": "mkdir tata/John tata/Mary tata/David tata/Sarah tata/Michael"},
  {"role": "user", "content": ""},
  {"role": "assistant", "content": "ls tata"},
  {"role": "user", "content": "David       John        Mary        Michael     Sarah"},
  {"role": "assistant", "content": "rm -rf tata/*a*"},
  {"role": "user", "content": ""},
  {"role": "assistant", "content": "ls tata"},
  {"role": "user", "content": "John"},
  {"role": "assistant", "content": "done"},
]



async function doTask(task) {

  messages.push({role: "user", content: task})

  while (true) {

    let response = await openai.chat.completions.create({
      model: config.model,
      messages
    })

    const message = response.choices[0].message

    // count tokens
    prompt_tokens      += response.usage.prompt_tokens
    completaion_tokens += response.usage.completion_tokens
    console.log(
      colors.green("prompt_tokens: "),
      colors.brightGreen(response.usage.prompt_tokens),
      "    ",
      colors.yellow("completion_tokens: "),
      colors.brightYellow(response.usage.completion_tokens),
      "    ",
      colors.yellow("total completion tokens: "),
      colors.bgYellow(completaion_tokens)
    )

    messages.push(message)

    if (message.content === "done") return

    const output = await exec(message.content)

    messages.push({role: "user", content: output})

  }
}


let task = ""
let newline = await input({ message: "Enter a task to do (blank line to launch execution):" })

while (true) {

  while (newline != "") {
    task += newline + "\n"
    newline = await input({ message: "" })
  }

  await doTask(task)

  console.log("Job's done")
  newline = await input({ message: 'Enter new task to do (blank line to launch execution):' })  

}

