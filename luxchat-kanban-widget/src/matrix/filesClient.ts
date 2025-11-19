import { MatrixClient } from "matrix-js-sdk";
import { MatrixFiles, IFolder } from "matrix-files-sdk";

export interface FilesClient {
  files: MatrixFiles;
  rootFolder: IFolder;
}

export async function createFilesClient(
  client: MatrixClient
): Promise<FilesClient> {
  const files = new MatrixFiles(client);

  // Load initial state
  await files.sync();

  // For simplicity, treat the top-level as the root workspace
  const rootFolder = await files.getRoot();

  return { files, rootFolder };
}
