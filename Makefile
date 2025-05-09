build-multi:
	docker buildx build --platform linux/amd64,linux/arm64 . -t yoziru/nextjs-vllm-ui

build:
	docker build . -t yoziru/nextjs-vllm-ui

run: build
	docker run --rm \
	-p 3000:3000 \
	-e VLLM_URL=${VLLM_URL} \
	-e VLLM_TOKEN_LIMIT=${VLLM_TOKEN_LIMIT} \
	-e VLLM_API_KEY=${VLLM_API_KEY} \
	yoziru/nextjs-vllm-ui
