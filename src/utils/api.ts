export async function analyzeImage(formData: FormData) {
  // Placeholder to call backend when available
  const res = await fetch('/api/analyze', { method: 'POST', body: formData })
  return res.json()
}

export async function chatMessage(message: string) {
  await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })
}
