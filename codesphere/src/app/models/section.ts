import { Video } from "./video";

export interface Section {
    id: number,
    title: string,
    description: string,
    orderIndex: number,
    videos: Video[],
}
