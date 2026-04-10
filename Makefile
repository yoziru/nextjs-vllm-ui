build-multi:
	docker buildx build --platform linux/amd64,linux/arm64 . -t yoziru/nextjs-vllm-ui

build:
	docker build . -t yoziru/nextjs-vllm-ui

run: build
	docker run --rm \
	-p 3000:3000 \
	-e LLM_PROVIDER=${LLM_PROVIDER} \
	-e VLLM_URL=${VLLM_URL} \
	-e VLLM_TOKEN_LIMIT=${VLLM_TOKEN_LIMIT} \
	-e VLLM_API_KEY=${VLLM_API_KEY} \
	-e OLLAMA_URL=${OLLAMA_URL} \
	-e OLLAMA_TOKEN_LIMIT=${OLLAMA_TOKEN_LIMIT} \
	-e OLLAMA_API_KEY=${OLLAMA_API_KEY} \
	-e OLLAMA_MODEL=${OLLAMA_MODEL} \
	-e OPENAI_URL=${OPENAI_URL} \
	-e OPENAI_API_KEY=${OPENAI_API_KEY} \
	-e OPENAI_MODEL=${OPENAI_MODEL} \
	-e OPENAI_TOKEN_LIMIT=${OPENAI_TOKEN_LIMIT} \
	-e CUSTOM_OPENAI_URL=${CUSTOM_OPENAI_URL} \
	-e CUSTOM_OPENAI_API_KEY=${CUSTOM_OPENAI_API_KEY} \
	-e CUSTOM_OPENAI_MODEL=${CUSTOM_OPENAI_MODEL} \
	-e CUSTOM_OPENAI_TOKEN_LIMIT=${CUSTOM_OPENAI_TOKEN_LIMIT} \
	yoziru/nextjs-vllm-ui
