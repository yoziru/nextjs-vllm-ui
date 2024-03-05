export async function GET(req: Request) {
  const res = await fetch(process.env.VLLM_URL + "/v1/models");
  return new Response(res.body, res);
}
