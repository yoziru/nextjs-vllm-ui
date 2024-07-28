# nextjs-vllm-ui

<div align="center">
  <img src="ollama-nextjs-ui.gif">
</div>

<h1 align="center">
  Fully-featured & beautiful web interface for vLLM & Ollama
</h1>

Get up and running with Large Language Models **quickly**, **locally** and even **offline**.
This project aims to be the easiest way for you to get started with LLMs. No tedious and annoying setup required!

# Features ✨

- **Beautiful & intuitive UI:** Inspired by ChatGPT, to enhance similarity in the user experience.
- **Fully local:** Stores chats in localstorage for convenience. No need to run a database.
- **Fully responsive:** Use your phone to chat, with the same ease as on desktop.
- **Easy setup:** No tedious and annoying setup required. Just clone the repo and you're good to go!
- **Code syntax highligting:** Messages that include code, will be highlighted for easy access.
- **Copy codeblocks easily:** Easily copy the highlighted code with one click.
- **Chat history:** Chats are saved and easily accessed.
- **Light & Dark mode:** Switch between light & dark mode.

# Preview

https://github.com/jakobhoeg/nextjs-ollama-llm-ui/assets/114422072/08eaed4f-9deb-4e1b-b87a-ba17d81b9a02

# Requisites ⚙️

To use the web interface, these requisites must be met:

1. Download [vLLM](https://docs.vllm.ai/en/latest/) and have it running. Or run it in a Docker container. 
2. [Node.js](https://nodejs.org/en/download) (18+), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) is required. 

# Usage 🚀

The easiest way to get started is to use the pre-built Docker image.

```
docker run --rm -d -p 3000:3000 -e VLLM_URL=http://host.docker.internal:8000 ghcr.io/yoziru/nextjs-vllm-ui:latest
```

If you're using Ollama, you need to set the `VLLM_MODEL`:
```
docker run --rm -d -p 3000:3000 -e VLLM_URL=http://host.docker.internal:11434 -e VLLM_TOKEN_LIMIT=8192 -e VLLM_MODEL=llama3 ghcr.io/yoziru/nextjs-vllm-ui:latest
```

If your server is running on a different IP address or port, you can use the `--network host` mode in Docker, e.g.:
```
docker run --rm -d --network host -e VLLM_URL=http://192.1.0.110:11434 -e VLLM_TOKEN_LIMIT=8192 -e VLLM_MODEL=llama3 ghcr.io/yoziru/nextjs-vllm-ui:latest
```

Then go to [localhost:3000](http://localhost:3000) and start chatting with your favourite model!

# Development 📖

To install and run a local environment of the web interface, follow the instructions below.

1. **Clone the repository to a directory on your pc via command prompt:**
    ```
    git clone https://github.com/yoziru/nextjs-vllm-ui
    ```

1. **Open the folder:**
    ```
    cd nextjs-vllm-ui
    ```

1. ** Rename the `.example.env` to `.env`:**
    ```
    mv .example.env .env
    ```

1. **If your instance of vLLM is NOT running on the default ip-address and port, change the variable in the .env file to fit your usecase:**
    ```
    VLLM_URL="http://localhost:8000"
    VLLM_API_KEY="your-api-key"
    VLLM_MODEL="llama3:8b"
    VLLM_TOKEN_LIMIT=4096
    ```

1. **Install dependencies:**
    ```
    yarn install
    ```

1. **Start the development server:**
    ```
    yarn dev
    ```

1. **Go to [localhost:3000](http://localhost:3000) and start chatting with your favourite model!**


You can also build and run the docker image locally with this command:
```sh
docker build . -t ghcr.io/yoziru/nextjs-vllm-ui:latest \
 && docker run --rm \
  -p 3000:3000 \
  -e VLLM_URL=http://host.docker.internal:11434 \
  -e VLLM_MODEL=llama3.1:8b-instruct-q8_0 \
  -e NEXT_PUBLIC_TOKEN_LIMIT="8192" \
  ghcr.io/yoziru/nextjs-vllm-ui:latest
```

# Tech stack

[NextJS](https://nextjs.org/) - React Framework for the Web

[TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

[shadcn-ui](https://ui.shadcn.com/) - UI component built using Radix UI and Tailwind CSS

[shadcn-chat](https://github.com/jakobhoeg/shadcn-chat) - Chat components for NextJS/React projects
