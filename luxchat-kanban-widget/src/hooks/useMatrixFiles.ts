import { useEffect, useState } from "react";
import { MatrixClient } from "matrix-js-sdk";
import { createMatrixClient } from "../matrix/matrixClient";
import { createFilesClient } from "../matrix/filesClient";
import { IFolder, MatrixFiles } from "matrix-files-sdk";

interface Result {
  filesClient: MatrixFiles | null;
  rootFolder: IFolder | null;
  loading: boolean;
  error?: string;
}

export function useMatrixFiles(): Result {
  const [state, setState] = useState<Result>({
    filesClient: null,
    rootFolder: null,
    loading: true
  });

  useEffect(() => {
    let client: MatrixClient;

    (async () => {
      try {
        client = createMatrixClient();
        await client.startClient({ initialSyncLimit: 0 });

        const { files, rootFolder } = await createFilesClient(client);
        setState({ filesClient: files, rootFolder, loading: false });
      } catch (e: any) {
        setState({
          filesClient: null,
          rootFolder: null,
          loading: false,
          error: e?.message ?? "Failed to initialise Matrix"
        });
      }
    })();

    return () => {
      client?.stopClient();
    };
  }, []);

  return state;
}
