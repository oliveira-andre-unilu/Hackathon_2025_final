import { createClient, MatrixClient } from "matrix-js-sdk";

export function createMatrixClient(): MatrixClient {
  const urlParams = new URLSearchParams(window.location.search);

  const baseUrl =
    urlParams.get("baseUrl") || import.meta.env.VITE_DEFAULT_HOMESERVER_URL;
  const accessToken = urlParams.get("accessToken") || "";
  const userId = urlParams.get("userId") || "";

  if (!baseUrl || !accessToken || !userId) {
    console.warn("Missing Matrix connection info; using env/dev config.");
  }

  const client = createClient({
    baseUrl,
    accessToken,
    userId
  });

  return client;
}
