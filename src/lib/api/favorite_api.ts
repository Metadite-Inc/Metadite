export async function addToFavorites(userId: string, modelId: string): Promise<any> {
  const response = await fetch(`/api/users/${userId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add to favorites');
  }

  return response.json();
}
