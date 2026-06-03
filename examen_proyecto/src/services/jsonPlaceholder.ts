export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Resultado enriquecido con el código HTTP — necesario para mostrar "200 OK" en pantalla
export type PostResult = {
  post: JsonPlaceholderPost;
  statusCode: number;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getPost(id: number): Promise<PostResult> {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  const post = await parseJson<JsonPlaceholderPost>(response);
  return {post, statusCode: response.status};
}

export async function updatePost(post: JsonPlaceholderPost): Promise<PostResult> {
  const response = await fetch(`${BASE_URL}/posts/${post.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(post),
  });

  const updatedPost = await parseJson<JsonPlaceholderPost>(response);
  return {post: updatedPost, statusCode: response.status};
}
