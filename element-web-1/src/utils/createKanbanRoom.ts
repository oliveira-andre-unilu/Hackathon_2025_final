import { MatrixClient } from "matrix-js-sdk/src/client";

export async function createKanbanRoom(client: MatrixClient): Promise<string> {
    // 1) Create a new room
    const result = await client.createRoom({
        name: "Kanban Board",
        preset: "private_chat",
    });

    const roomId = result.room_id;

    // 2) Add the NeoBoard widget as room state
    await client.sendStateEvent(
        roomId,
        "im.vector.modular.widgets",
        {
            creatorUserId: client.getUserId(),
            id: "neoboard",
            type: "m.custom",
            name: "NeoBoard",
            avatar_url: null,
            data: {},
            url: "http://localhost:5273/", // your local NeoBoard dev URL
            waitForIframeLoad: true,
            addToAccessList: true,
        },
        "neoboard", // state_key
    );

    return roomId;
}
