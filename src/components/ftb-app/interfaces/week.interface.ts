import { Match } from "./match.interface";

export interface Week {
    title: string,
    games: Array<Match>,
    completed?: boolean
};
