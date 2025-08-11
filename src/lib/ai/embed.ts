export async function embed(text: string): Promise<number[]> {
  const res = await fetch("http://localhost:6969/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: [text] }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Embedding server failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.embeddings[0]; // array of floats (length 384)
}
