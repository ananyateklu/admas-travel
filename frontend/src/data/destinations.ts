import caribbeanImage from '../assets/destination/caribbean.jpg';
import mexicoImage from '../assets/destination/mexico.jpg';
import europeImage from '../assets/destination/europe.jpg';
import hawaiiImage from '../assets/destination/hawaii.jpg';
import israelImage from '../assets/destination/israel.jpg';
import usaImage from '../assets/destination/usa.jpg';
import australiaImage from '../assets/destination/australia.jpg';
import ethiopiaVolcanoImage from '../assets/ethiopia-volcano.jpg';
import lalibelaImage from '../assets/lalibela-two.jpg';
import axumImage from '../assets/axum.jpeg';
import gonderImage from '../assets/gonder.jpg';
import omoValleyImage from '../assets/omo-valley-guy.jpeg';
import baleMountainsImage from '../assets/bale-mountains.jpeg';
import danakilImage from '../assets/danakil.jpg';
import tanaLakeImage from '../assets/tana-lake.jpeg';
import simienmountainsImage from '../assets/simien-mountains-fox.jpeg';

export interface Region {
    id: string;
    name: string;
    places: string;
    image: string;
    description: string;
}

export interface EthiopianDestination {
    name: string;
    count: number;
    image: string;
    description: string;
}

export interface EthiopianRegions {
    north: EthiopianDestination[];
    south: EthiopianDestination[];
    east: EthiopianDestination[];
    central: EthiopianDestination[];
}

export const vacationRegions: Region[] = [
    {
        id: 'ethiopia',
        name: 'Ethiopia',
        places: '01 Places',
        image: ethiopiaVolcanoImage,
        description: 'Volcanic wonders and ancient landscapes'
    },
    {
        id: 'caribbean',
        name: 'The Caribbean',
        places: '02 Places',
        image: caribbeanImage,
        description: 'Pristine beaches and crystal-clear waters await'
    },
    {
        id: 'mexico',
        name: 'Mexico',
        places: '03 Places',
        image: mexicoImage,
        description: 'Ancient ruins and vibrant culture'
    },
    {
        id: 'europe',
        name: 'Europe',
        places: '04 Places',
        image: europeImage,
        description: 'Historic cities and timeless charm'
    },
    {
        id: 'hawaii',
        name: 'Hawaii',
        places: '05 Places',
        image: hawaiiImage,
        description: 'Paradise islands and tropical adventures'
    },
    {
        id: 'israel',
        name: 'Israel',
        places: '06 Places',
        image: israelImage,
        description: 'Sacred sites and rich history'
    },
    {
        id: 'usa',
        name: 'USA',
        places: '07 Places',
        image: usaImage,
        description: 'Diverse landscapes and vibrant cities'
    },
    {
        id: 'australia',
        name: 'Australia',
        places: '08 Places',
        image: australiaImage,
        description: 'Outback adventures and coastal wonders'
    }
];

export const ethiopianRegions: EthiopianRegions = {
    north: [
        {
            name: "Lalibela",
            count: 4,
            image: lalibelaImage,
            description: "Ancient rock-hewn churches carved from solid rock, a testament to Ethiopian Orthodox Christianity."
        },
        {
            name: "Axum",
            count: 3,
            image: axumImage,
            description: "Ancient capital with massive obelisks and tombs, home to the claimed Ark of the Covenant."
        },
        {
            name: "Gondar",
            count: 5,
            image: gonderImage,
            description: "Medieval castles known as Africa's Camelot, featuring unique Portuguese and Indian architecture."
        }
    ],
    south: [
        {
            name: "Omo Valley",
            count: 6,
            image: omoValleyImage,
            description: "Home to fascinating indigenous tribes with unique traditions and colorful ceremonies."
        },
        {
            name: "Bale Mountains",
            count: 4,
            image: baleMountainsImage,
            description: "Diverse ecosystems from moorlands to forests, home to the endangered Ethiopian Wolf."
        }
    ],
    east: [
        {
            name: "Danakil Depression",
            count: 3,
            image: danakilImage,
            description: "Surreal landscapes with colorful minerals, active volcanoes, and vast salt flats."
        }
    ],
    central: [
        {
            name: "Lake Tana",
            count: 5,
            image: tanaLakeImage,
            description: "Ancient monasteries on islands, preserving remarkable murals and religious artifacts."
        },
        {
            name: "Simien Mountains",
            count: 7,
            image: simienmountainsImage,
            description: "UNESCO site with breathtaking landscapes and unique wildlife like Gelada baboons."
        }
    ]
}; 