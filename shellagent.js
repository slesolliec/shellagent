
import OpenAI from "openai"
import colors from "colors"
import exec   from "./exec.js"
import config from "./config.js"


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
    Once you have completed the task, type "done".
    If something goes wrong, don't apologize, just try again with a new shell command.`},
  {"role": "user", "content": `Please do the following tasks step by step:
    - Create 5 sub directories named after common first names in directory 'tata'
    - list them
    - delete all sub directories that are in the 'tata' directory, that have a "a" in their name.
    - list remaining sub directories`},
  {"role": "assistant", "content": "ls"},
  {"role": "user", "content": `discord.bot.js       exec.js              node_modules/        openai-nodefetch.js  openai.js            package-lock.json    package.json         titi/                toto/`},
  // {"role": "assistant", "content": "mkdir tata"},
  // {"role": "user", "content": ""},
  //    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
  //    {"role": "user", "content": "Where was it played?"}
]



while (true) {

  let response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    // model: "gpt-4",
    messages
  })

  const message = response.choices[0].message

  // count tokens
  prompt_tokens      += response.usage.prompt_tokens
  completaion_tokens += response.usage.completion_tokens
  console.log(
    colors.green("prompt_tokens: "),
    colors.brightGreen(prompt_tokens),
    "    ",
    colors.yellow("completion_tokens: "),
    colors.brightYellow(completaion_tokens)
  )

  messages.push(message)

  if (message.content === "done") break

  const output = await exec(message.content)

  messages.push({role: "user", content: output})

}

console.log("done")

