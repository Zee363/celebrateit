export async function chatWithMuse({ message, bride, vendors, history }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('Missing VITE_API_URL environment variable');
  }

  const response = await fetch(`${apiUrl}/api/muse-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, bride, vendors, history })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `Muse API request failed with status ${response.status}`);
  }

  return response.json();
}
