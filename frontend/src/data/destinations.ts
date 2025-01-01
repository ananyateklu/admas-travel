import caribbeanImage from '../assets/destination/caribbean.jpg';
import mexicoImage from '../assets/destination/mexico.jpg';
import europeImage from '../assets/destination/europe.jpg';
import hawaiiImage from '../assets/destination/hawaii.jpg';
import israelImage from '../assets/destination/israel.jpg';
import africaSafarisImage from '../assets/destination/africa-safaris.jpg';
import usaImage from '../assets/destination/usa.jpg';
import australiaImage from '../assets/destination/australia.jpg';
import lalibelaImage from '../assets/lalibela-two.jpg';
import axumImage from '../assets/axum.jpeg';
import gonderImage from '../assets/gonder.jpg';
import omoValleyImage from '../assets/omo-valley-guy.jpeg';
import baleMountainsImage from '../assets/bale-mountains.jpeg';
import danakelImage from '../assets/danakel.jpg';
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
}

export interface EthiopianRegions {
    north: EthiopianDestination[];
    south: EthiopianDestination[];
    east: EthiopianDestination[];
    central: EthiopianDestination[];
}

export const vacationRegions: Region[] = [
    {
        id: 'caribbean',
        name: 'The Caribbean',
        places: '01 Places',
        image: caribbeanImage,
        description: 'Pristine beaches and crystal-clear waters await'
    },
    {
        id: 'mexico',
        name: 'Mexico',
        places: '02 Places',
        image: mexicoImage,
        description: 'Ancient ruins and vibrant culture'
    },
    {
        id: 'europe',
        name: 'Europe',
        places: '03 Places',
        image: europeImage,
        description: 'Historic cities and timeless charm'
    },
    {
        id: 'hawaii',
        name: 'Hawaii',
        places: '04 Places',
        image: hawaiiImage,
        description: 'Paradise islands and tropical adventures'
    },
    {
        id: 'israel',
        name: 'Israel',
        places: '05 Places',
        image: israelImage,
        description: 'Sacred sites and rich history'
    },
    {
        id: 'usa',
        name: 'USA',
        places: '06 Places',
        image: usaImage,
        description: 'Diverse landscapes and vibrant cities'
    },
    {
        id: 'ethiopia',
        name: 'Ethiopia',
        places: '07 Places',
        image: africaSafarisImage,
        description: 'Ancient culture and stunning landscapes'
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
        { name: "Lalibela", count: 4, image: lalibelaImage },
        { name: "Axum", count: 3, image: axumImage },
        { name: "Gondar", count: 5, image: gonderImage }
    ],
    south: [
        { name: "Omo Valley", count: 6, image: omoValleyImage },
        { name: "Bale Mountains", count: 4, image: baleMountainsImage }
    ],
    east: [
        { name: "Danakil Depression", count: 3, image: danakelImage }
    ],
    central: [
        { name: "Lake Tana", count: 5, image: tanaLakeImage },
        { name: "Simien Mountains", count: 7, image: simienmountainsImage }
    ]
}; 