from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.post('/api/chat')
def chat():
    data = request.get_json(force=True)
    messages = data.get('messages', [])
    # In a real implementation this is where you would query the model
    # Here we simply echo back the last user message.
    user_msg = next((m['content'] for m in reversed(messages) if m.get('role') == 'user'), '')
    content = f"Echo: {user_msg}"

    response = {
        "id": f"chatcmpl-mock-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": "gemma-3-27b-it-GPTQ-4b-128g",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": content},
                "finish_reason": "stop"
            }
        ],
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
