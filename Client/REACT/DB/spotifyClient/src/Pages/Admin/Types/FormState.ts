import type { Track } from "../../../Model/Track";

export type FormState =
    { mode: "none" } |
    { mode: "new" } |
    {
        mode: "edit";
        song: Track;
    }


