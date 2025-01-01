import lalibelaImage from '../assets/lalibela-two.jpg';
import danakilImage from '../assets/danakil.jpg';
import simienmountainsImage from '../assets/simien-mountains-fox.jpeg';
import omoValleyImage from '../assets/omo-valley-guy.jpeg';
import axumImage from '../assets/axum.jpeg';
import gonderImage from '../assets/gonder.jpg';
import baleMountainsImage from '../assets/bale-mountains.jpeg';
import tanaLakeImage from '../assets/tana-lake.jpeg';

export interface FeaturedDestination {
    name: string;
    description: string;
    image: string;
    link: string;
    country: string;
}

export const featuredDestinations: FeaturedDestination[] = [
    {
        name: "Lalibela",
        description: "Ancient rock-hewn churches, a UNESCO World Heritage site",
        image: lalibelaImage,
        link: "/trips/lalibela",
        country: "Ethiopia"
    },
    {
        name: "Danakil Depression",
        description: "Earth's lowest and hottest place, with otherworldly landscapes",
        image: danakilImage,
        link: "/trips/danakil",
        country: "Ethiopia"
    },
    {
        name: "Simien Mountains",
        description: "Home to endemic wildlife and breathtaking vistas",
        image: simienmountainsImage,
        link: "/trips/simien",
        country: "Ethiopia"
    },
    {
        name: "Omo Valley",
        description: "Cultural heritage and traditional tribes of Ethiopia",
        image: omoValleyImage,
        link: "/trips/omo",
        country: "Ethiopia"
    },
    {
        name: "Axum",
        description: "Ancient capital with mysterious obelisks and rich history",
        image: axumImage,
        link: "/trips/axum",
        country: "Ethiopia"
    },
    {
        name: "Gondar",
        description: "Medieval castles and churches in the 'Camelot of Africa'",
        image: gonderImage,
        link: "/trips/gondar",
        country: "Ethiopia"
    },
    {
        name: "Bale Mountains",
        description: "Alpine peaks and rare wildlife in Ethiopia's largest national park",
        image: baleMountainsImage,
        link: "/trips/bale",
        country: "Ethiopia"
    },
    {
        name: "Lake Tana",
        description: "Ancient monasteries and the source of the Blue Nile",
        image: tanaLakeImage,
        link: "/trips/lake-tana",
        country: "Ethiopia"
    }
];

