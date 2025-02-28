import { Place } from "../place/place";
import moment from "moment";

export interface Match {
    id: number;
    peopleCapacity: number;
    registeredPeople: number;
    localName: string;
    visitorName: string;
    place: Place;
    startTime: Date;
    endTime: Date;
    entryCost: string;
    registeredUsers: RegisteredUser[];
}

export interface MatchAdapted {
    id: number;
    peopleCapacity: number;
    registeredPeople: number;
    localName: string;
    visitorName: string;
    place: Place;
    matchDay: string;
    startTime: string;
    endTime: string;
    entryCost: number;
    registeredUsers: RegisteredUser[];
}

export interface RegisteredUser {
    id: number;
    name: string;
    ticketsBought: number;
    assist: boolean;
}

export class MatchAdapter {
    static fromExternalToInternal(externalMatch: Match): MatchAdapted {


        return {
            id: externalMatch.id,
            peopleCapacity: externalMatch.peopleCapacity,
            registeredPeople: externalMatch.registeredPeople,
            localName: externalMatch.localName,
            visitorName: externalMatch.visitorName,
            place: externalMatch.place,
            matchDay: moment(externalMatch.startTime).format('MMMM D, YYYY'),
            startTime: moment(externalMatch.startTime).format('h:mm A'),
            endTime: moment(externalMatch.startTime).format('h:mm A'),
            entryCost: parseInt(externalMatch.entryCost) / 100,
            registeredUsers: externalMatch.registeredUsers,
        };
    }
}