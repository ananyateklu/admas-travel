import mountainsBgImage from "../../../assets/mountains.jpeg";
import lalibelaImage from "../../../assets/lalibela-three.jpeg";
import axumImage from "../../../assets/axum-two.jpeg";
import gonderImage from "../../../assets/gonder-two.jpg";
import omoValleyImage from "../../../assets/omo-valley-guy.jpeg";
import baleMountainsImage from "../../../assets/bale-mountains-two.jpeg";
import danakilImage from "../../../assets/danakil-two.jpg";
import abayRiverImage from "../../../assets/abay-river-two.jpeg";
import tanaLakeImage from "../../../assets/tana-lake-two.jpeg";
import ertaAleImage from "../../../assets/ethiopia-volcano.jpg";

export interface Wonder {
    id: string;
    title: string;
    description: string;
    image: string;
    region?: string;
}

export const wonders: Wonder[] = [
    {
        id: 'simien-mountains',
        title: 'Simien Mountains',
        description: 'Experience the breathtaking landscapes and unique wildlife of the Simien Mountains, a UNESCO World Heritage site. Home to rare species like the Gelada baboon and Walia ibex, these mountains offer stunning views and world-class trekking opportunities.',
        image: mountainsBgImage,
        region: 'Amhara'
    },
    {
        id: 'erta-ale',
        title: 'Erta Ale Volcano',
        description: 'Marvel at Erta Ale, one of the world\'s few permanent lava lakes and Ethiopia\'s most active volcano. Known as the "Smoking Mountain" in the local Afar language, this otherworldly crater offers a rare glimpse into Earth\'s molten heart with its mesmerizing display of bubbling lava.',
        image: ertaAleImage,
        region: 'Afar'
    },
    {
        id: 'danakil',
        title: 'Danakil Depression',
        description: 'Explore the surreal landscapes of the Danakil Depression, one of the hottest and most unique places on Earth. With its colorful mineral formations, active volcanoes, and salt flats, it\'s often called "the gateway to hell" for its extreme conditions.',
        image: danakilImage,
        region: 'Afar'
    },
    {
        id: 'lalibela',
        title: 'Rock-Hewn Churches',
        description: 'Discover the ancient rock-hewn churches of Lalibela, a testament to Ethiopian Orthodox Christianity and medieval architecture. These 11 monolithic churches, carved from solid rock in the 12th-13th centuries, are a marvel of human creativity and devotion.',
        image: lalibelaImage,
        region: 'Amhara'
    },
    {
        id: 'axum',
        title: 'Ancient Axum',
        description: 'Step back in time in Axum, the ancient capital of the Aksumite Empire. Home to massive obelisks, ancient tombs, and the claimed resting place of the Ark of the Covenant, this historic city reveals Ethiopia\'s rich cultural heritage.',
        image: axumImage,
        region: 'Tigray'
    },
    {
        id: 'gondar',
        title: 'Castles of Gondar',
        description: 'Visit the medieval castles of Gondar, known as "Africa\'s Camelot." These 17th-century royal enclosure features unique architecture blending Portuguese, Indian, and local styles, showcasing Ethiopia\'s imperial history.',
        image: gonderImage,
        region: 'Amhara'
    },
    {
        id: 'omo-valley',
        title: 'Omo Valley',
        description: 'Immerse yourself in the cultural diversity of the Omo Valley, home to some of Africa\'s most fascinating indigenous tribes. Experience unique traditions, colorful ceremonies, and ways of life that have remained unchanged for centuries.',
        image: omoValleyImage,
        region: 'SNNPR'
    },
    {
        id: 'bale-mountains',
        title: 'Bale Mountains',
        description: 'Trek through the diverse ecosystems of the Bale Mountains National Park, from afro-alpine moorlands to dense forests. Home to the endangered Ethiopian Wolf and numerous endemic species, it\'s a paradise for nature lovers.',
        image: baleMountainsImage,
        region: 'Oromia'
    },
    {
        id: 'blue-nile',
        title: 'Blue Nile Falls',
        description: 'Witness the power of the Blue Nile Falls, locally known as Tis Issat - "Smoking Water." This magnificent waterfall demonstrates the raw beauty of Ethiopia\'s natural wonders and the source of the mighty Blue Nile River.',
        image: abayRiverImage,
        region: 'Amhara'
    },
    {
        id: 'lake-tana',
        title: 'Lake Tana Monasteries',
        description: 'Explore the ancient monasteries scattered across the islands of Lake Tana, the source of the Blue Nile. These medieval churches house remarkable murals and religious artifacts, preserving Ethiopia\'s Christian heritage.',
        image: tanaLakeImage,
        region: 'Amhara'
    }
]; 