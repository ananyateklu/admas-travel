import lalibelaSecondImage from '../assets/lalibela.jpeg';
import mountainMonkeyImage from '../assets/mountain-monkey.jpg';
import abayRiverImage from '../assets/abay-river.jpeg';

export interface Highlight {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
}

export const highlights: Highlight[] = [
    {
        id: 'historical-tours',
        title: "Rock-Hewn Churches",
        description: "Explore the magnificent churches of Lalibela",
        image: lalibelaSecondImage,
        category: "Historical"
    },
    {
        id: 'wildlife-safari',
        title: "Endemic Wildlife",
        description: "Meet the unique Gelada baboons in their natural habitat",
        image: mountainMonkeyImage,
        category: "Nature"
    },
    {
        id: 'natural-wonders',
        title: "Natural Wonders",
        description: "Witness the power of the Blue Nile Falls",
        image: abayRiverImage,
        category: "Adventure"
    }
]; 