# nextjs-vllm-ui

Forked from https://github.com/jakobhoeg/nextjs-ollama-llm-ui

<div align="center">
  <img src="ollama-nextjs-ui.gif">
</div>

<h1 align="center">
  Fully-featured & beautiful web interface for vLLM, Ollama, OpenAI, and OpenAI-compatible APIs
</h1>

Get up and running with Large Language Models **quickly**, **locally** and even **offline**.
This project aims to be the easiest way for you to get started with LLMs. No tedious and annoying setup required!

# Features ✨

- **Beautiful & intuitive UI:** Inspired by ChatGPT, to enhance similarity in the user experience.
- **Fully local:** Stores chats in localstorage for convenience. No need to run a database.
- **Fully responsive:** Use your phone to chat, with the same ease as on desktop.
- **Multiple providers:** Use vLLM, Ollama, OpenAI, or another OpenAI-compatible API with optional API-key auth.
- **Easy setup:** No tedious and annoying setup required. Just clone the repo and you're good to go!
- **Code syntax highligting:** Messages that include code, will be highlighted for easy access.
- **Copy codeblocks easily:** Easily copy the highlighted code with one click.
- **Chat history:** Chats are saved and easily accessed.
- **Light & Dark mode:** Switch between light & dark mode.

# Preview

https://github.com/jakobhoeg/nextjs-ollama-llm-ui/assets/114422072/08eaed4f-9deb-4e1b-b87a-ba17d81b9a02

# Requisites ⚙️

To use the web interface, these requisites must be met:

1. Have a model provider available: [vLLM](https://docs.vllm.ai/en/latest/), Ollama's OpenAI-compatible API, OpenAI, or another OpenAI-compatible endpoint.
2. [Node.js](https://nodejs.org/en/download) (18+), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) is required.

# Usage 🚀

The easiest way to get started is to use the pre-built Docker image.

```
docker run --rm -d -p 3000:3000 -e VLLM_URL=http://host.docker.internal:8000 ghcr.io/yoziru/nextjs-vllm-ui:latest
```

If you're using Ollama, set the Ollama provider variables:

```
docker run --rm -d -p 3000:3000 -e OLLAMA_URL=http://host.docker.internal:11434 -e OLLAMA_TOKEN_LIMIT=8192 -e OLLAMA_MODEL=llama3 ghcr.io/yoziru/nextjs-vllm-ui:latest
```

For OpenAI, set your API key and model:

```sh
docker run --rm -d -p 3000:3000 \
  -e OPENAI_API_KEY=sk-your-key \
  -e OPENAI_MODEL=gpt-4o-mini \
  ghcr.io/yoziru/nextjs-vllm-ui:latest
```

You can also choose the provider, base URL, API key, and model in the Settings panel. Server-side environment variables are safer for shared deployments; browser-entered API keys are stored in that browser's localStorage.

## Docker Compose

This repo now includes a `docker-compose.yml` for local testing.

1. Copy the example env file:

   ```sh
   cp .example.env .env
   ```

2. Set the provider variables you want to test in `.env`.

   Example for OpenAI:

   ```sh
   OPENAI_API_KEY="sk-your-key"
   OPENAI_MODEL="gpt-4o-mini"
   ```

   Example for Ollama:

   ```sh
   OLLAMA_URL="http://host.docker.internal:11434"
   OLLAMA_MODEL="llama3"
   OLLAMA_TOKEN_LIMIT=8192
   ```

   Example for vLLM:

   ```sh
   VLLM_URL="http://host.docker.internal:8000"
   VLLM_MODEL="meta-llama/Llama-3.1-8B-Instruct"
   VLLM_TOKEN_LIMIT=8192
   ```

3. Start the app:

   ```sh
   docker compose up --build
   ```

4. Open `http://localhost:3000`.

5. In Settings, choose the provider you want to use:
   - `OpenAI` for `OPENAI_*`
   - `Ollama` for `OLLAMA_*`
   - `vLLM` for `VLLM_*`
   - `OpenAI-compatible` for `CUSTOM_OPENAI_*` or a manual endpoint

If you are connecting from Docker to a service running on your host machine, `host.docker.internal` is usually the right hostname on Docker Desktop.

If your server is running on a different IP address or port, you can use the `--network host` mode in Docker, e.g.:

```
docker run --rm -d --network host -e OLLAMA_URL=http://192.1.0.110:11434 -e OLLAMA_TOKEN_LIMIT=8192 -e OLLAMA_MODEL=llama3 ghcr.io/yoziru/nextjs-vllm-ui:latest
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

1. **Configure your provider in `.env`:**

   ```
   VLLM_URL="http://localhost:8000"
   VLLM_API_KEY="your-api-key"
   VLLM_MODEL="llama3:8b"
   VLLM_TOKEN_LIMIT=4096

   OLLAMA_URL="http://localhost:11434"
   OLLAMA_MODEL="llama3"
   OLLAMA_TOKEN_LIMIT=8192

   OPENAI_API_KEY="sk-your-key"
   OPENAI_MODEL="gpt-4o-mini"
   OPENAI_TOKEN_LIMIT=128000
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

# Testing

Here is a simple manual test plan for provider support:

1. Start the UI with `docker compose up --build` or `yarn dev`.
2. Open Settings and verify you can switch between `vLLM`, `Ollama`, `OpenAI`, and `OpenAI-compatible`.
3. For each provider you care about, confirm:
   - model list loads successfully
   - selected model persists in the UI
   - sending a prompt returns a streamed response
   - token counter still updates
4. For OpenAI specifically, test both:
   - server-side env vars like `OPENAI_API_KEY`
   - browser-entered API key and model in Settings
5. For a custom endpoint, verify the base URL works when entered without manually appending `/v1`.

Suggested PR notes:

1. Added provider-aware chat/model/settings routing for `vllm`, `ollama`, `openai`, and custom OpenAI-compatible APIs.
2. Added provider configuration fields in Settings for base URL, API key, and model selection.
3. Added `.example.env` entries and Docker Compose support for local verification.
4. Verified TypeScript with `tsc --noEmit` and lint with `next lint` without running a full production build.

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
