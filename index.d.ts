declare namespace meinfernbus {
    interface Availability {
        seats: number;
        slots: number;
    }

    interface Coordinates {
        latitude: number;
        longitude: number;
    }

    interface Country {
        name: string;
        code: string;
    }

    interface Info {
        title: string;
        hint: string;
        message: string;
    }

    interface Journey {
        type: 'journey';
        origin: JourneyResponsePlace;
        destination: JourneyResponsePlace;
        id: number;
        direct: boolean;
        rides: any[];
        departure: Date;
        arrival: Date;
        legs: JourneyResponseLeg[];
        status: string,
        borders: boolean;
        available: Availability;
        operators: Operator[];
        price: Price;
        info: Info;
        warnings: any[];
    }

    interface JourneysOptions extends Options {
        adults?: number;
        children?: number;
        bikes?: number;
        search_by?: 'regions' | 'stations';
    }

    interface JourneyRequestPlace {
        id: string;
        type: 'region' | 'station';
    }

    interface JourneyResponseLeg {
        origin: JourneyResponsePlace,
        destination: JourneyResponsePlace;
        departure: Date;
        arrival: Date;
        operator: Operator;
    }

    interface JourneyResponsePlace {
        type: 'station' | 'region';
        id: number;
        name: string;
        importance?: number;
    }

    interface Operator {
        type: 'operator';
        id: string;
        name: string;
        url: string;
        address: string;
    }

    interface Options {
        key?: string;
    }

    interface Price {
        amount: number;
        currency: string;
        discounts: any;
        sale_restriction: boolean;
        available: boolean;
    }

    interface Region {
        type: 'region';
        id: number;
        name: string;
        coordinates: Coordinates;
        country: Country;
        class: string;
        stations: number[];
        connections: number[];
        slug: string;
    }

    interface Station {
        type: 'station';
        id: number;
        name: string;
        street: string;
        zip: string;
        address: string;
        coordinates: Coordinates;
        slug: string;
        aliases: any[];
        regions: number[];
        connections: number[];
        importance: number;
        country: Country;
    }

    function journeys(origin: string | JourneyRequestPlace, destination: string | JourneyRequestPlace, date: Date, opt?: JourneysOptions): Promise<Journey[]>;
    function stations(opt?: Options): Promise<Station[]>;
    function regions(opt?: Options): Promise<Region[]>;
}

export = meinfernbus;