
# Shell Agent

When you've spent a day pasting error messages to chatGPT then pasting commands back to the shell,
you realize that YOU are the bottleneck!!

The whole point of this project is to eliminate the bottleneck.

## How to use

- You need nodeJS and NPM
- clone project
- `npm install` to get the packages
- copy config-example.js to config.js and put your openAI api key
- run shellagent.js with `node shellagent.js`

## Which model can you use?

If you are a chatGPT plus user, you can get an api key for free and use the gpt-3.5 models. But you cannot use gpt-4.

If you are an API user, you can use all models.

So far, I don't see gpt-4 being much better than gpt-3.5-turbo.

## Problems

1. GPT talks too much, even if I've asked him just to "speak" shell commands.
1. GPT has trouble realising he has completed the task.
1. the exec() wrapper is a non interactive shell, so many things that would simply work with an interactive shell don't work here. (like login with ssh, he does not find my ssh key).

