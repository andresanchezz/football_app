import { Place } from "../place/place";

export interface Match {
    id:               number;
    peopleCapacity:   number;
    registeredPeople: number;
    localName:        string;
    visitorName:      string;
    place:            Place;
    startTime:        Date;
    endTime:          Date;
    entryCost:        string;
    registeredUsers:  RegisteredUser[];
}

export interface RegisteredUser {
    id:            number;
    name:          string;
    ticketsBought: number;
    assist:        boolean;
}


export interface NewMatch {
    peopleCapacity:   number;
    localName:        string;
    visitorName:      string;
    placeId:          number; 
    startTime:        Date; 
    endTime:          Date; 
    entryCost:        number;
}
