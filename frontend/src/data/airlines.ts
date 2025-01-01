import ethiopianAirlinesImage from '../assets/ethiopian-airlines-two.jpg';
import emiratesAirlinesImage from '../assets/emirates-airlines.jpg';
import qatarAirlinesImage from '../assets/quatar-airlines.jpg';
import turkishAirlinesImage from '../assets/turkish-airlines.jpg';
import koreanAirlinesImage from '../assets/korean-airlines.jpg';
import japanAirlinesImage from '../assets/japan-airlines.jpg';
import alaskaAirlinesImage from '../assets/alaska-airlines.jpg';
import deltaAirlinesImage from '../assets/delta-airlines.jpg';
import airCanadaAirlinesImage from '../assets/air-canada-airlines.jpg';
import singaporeAirlinesImage from '../assets/singapore-airlines.jpg';
import spiritAirlinesImage from '../assets/spirit-airlines.jpg';
import unitedAirlinesImage from '../assets/united-airlines.jpg';
import americanAirlinesImage from '../assets/american-airlines.jpg';
import klmAirlinesImage from '../assets/klm-airlines.jpg';
import lufthansaAirlinesImage from '../assets/lufthansa-airlines.jpg';

export interface Airline {
    id: string;
    name: string;
    description: string;
    image: string;
    isMainPartner?: boolean;
    features: string[];
    hub: string;
}

export const partnerAirlines: Airline[] = [
    {
        id: 'ethiopian',
        name: "Ethiopian Airlines",
        description: "Africa's largest airline with an extensive network across Africa, Europe, Asia, and the Americas. Known for its modern fleet and exceptional service.",
        image: ethiopianAirlinesImage,
        isMainPartner: true,
        features: ["Modern fleet of Boeing 787s and Airbus A350s", "Extensive African network", "Award-winning skylight loyalty program"],
        hub: "Addis Ababa Bole International Airport"
    },
    {
        id: 'lufthansa',
        name: "Lufthansa",
        description: "Germany's flagship carrier and one of Europe's leading airlines, known for its premium service, extensive network, and technical excellence in aviation.",
        image: lufthansaAirlinesImage,
        features: ["5-star airline rating", "Miles & More loyalty program", "Extensive European and global network"],
        hub: "Frankfurt Airport"
    },
    {
        id: 'american',
        name: "American Airlines",
        description: "One of the world's largest airlines, offering an extensive global network with a strong presence in the Americas, Europe, and Asia. Known for its modern fleet and AAdvantage loyalty program.",
        image: americanAirlinesImage,
        features: ["World's largest airline fleet", "AAdvantage loyalty program", "Comprehensive domestic and international network"],
        hub: "Dallas/Fort Worth International Airport"
    },
    {
        id: 'klm',
        name: "KLM Royal Dutch Airlines",
        description: "The world's oldest operating airline, KLM offers premium service connecting Europe with global destinations through its modern fleet and Dutch hospitality.",
        image: klmAirlinesImage,
        features: ["Extensive European network", "Flying Blue loyalty program", "Sustainable aviation pioneer"],
        hub: "Amsterdam Airport Schiphol"
    },
    {
        id: 'delta',
        name: "Delta Air Lines",
        description: "One of America's largest airlines, known for its reliability, extensive domestic network, and superior customer service across the Americas and beyond.",
        image: deltaAirlinesImage,
        features: ["Industry-leading reliability", "SkyMiles loyalty program", "Extensive domestic and international network"],
        hub: "Hartsfield-Jackson Atlanta International Airport"
    },
    {
        id: 'air-canada',
        name: "Air Canada",
        description: "Canada's flag carrier and largest airline, offering premium service and connecting North America with the world through its modern fleet.",
        image: airCanadaAirlinesImage,
        features: ["Award-winning business class", "Extensive North American coverage", "Aeroplan loyalty program"],
        hub: "Toronto Pearson International Airport"
    },
    {
        id: 'singapore',
        name: "Singapore Airlines",
        description: "Renowned for its premium service and luxury travel experience, consistently rated among the world's best airlines with unparalleled Asian hospitality.",
        image: singaporeAirlinesImage,
        features: ["World-class premium cabins", "Award-winning service", "Modern A380 and Boeing 787 fleet"],
        hub: "Singapore Changi Airport"
    },
    {
        id: 'spirit',
        name: "Spirit Airlines",
        description: "America's leading ultra-low-cost carrier, making air travel accessible with competitive fares while maintaining a modern, fuel-efficient fleet.",
        image: spiritAirlinesImage,
        features: ["Ultra-low fares", "Modern Airbus fleet", "Extensive US and Caribbean network"],
        hub: "Fort Lauderdale-Hollywood International Airport"
    },
    {
        id: 'united',
        name: "United Airlines",
        description: "One of the world's largest airlines, offering comprehensive global coverage with a focus on customer comfort and innovative travel solutions.",
        image: unitedAirlinesImage,
        features: ["Global route network", "MileagePlus rewards", "Polaris business class"],
        hub: "Chicago O'Hare International Airport"
    },
    {
        id: 'emirates',
        name: "Emirates",
        description: "One of the world's premier airlines, connecting global destinations through its ultra-modern hub in Dubai with unparalleled luxury.",
        image: emiratesAirlinesImage,
        features: ["World-class first and business class", "Global route network", "Award-winning ICE entertainment system"],
        hub: "Dubai International Airport"
    },
    {
        id: 'qatar',
        name: "Qatar Airways",
        description: "Voted World's Best Airline multiple times, offering premium service and an extensive global network through its state-of-the-art hub.",
        image: qatarAirlinesImage,
        features: ["World's Best Business Class", "Modern fleet with Qsuite", "Global network to 160+ destinations"],
        hub: "Hamad International Airport"
    },
    {
        id: 'turkish',
        name: "Turkish Airlines",
        description: "Flying to more countries than any other airline, offering a unique blend of European and Asian hospitality.",
        image: turkishAirlinesImage,
        features: ["Largest flight network globally", "Award-winning cuisine", "Modern fleet and premium service"],
        hub: "Istanbul Airport"
    },
    {
        id: 'korean',
        name: "Korean Air",
        description: "Leading Asian carrier known for its premium service and extensive transpacific network with excellent connections across Asia.",
        image: koreanAirlinesImage,
        features: ["Premium transpacific service", "Extensive Asian network", "Exceptional Korean hospitality"],
        hub: "Incheon International Airport"
    },
    {
        id: 'japan',
        name: "Japan Airlines",
        description: "Japan's premier carrier offering impeccable service and connecting Asia with the world through its sophisticated network.",
        image: japanAirlinesImage,
        features: ["Renowned Japanese hospitality", "Modern fleet with premium cabins", "Extensive domestic Japan network"],
        hub: "Tokyo Narita & Haneda Airports"
    },
    {
        id: 'alaska',
        name: "Alaska Airlines",
        description: "Leading North American carrier known for its exceptional service and comprehensive coverage of the American West Coast.",
        image: alaskaAirlinesImage,
        features: ["Comprehensive West Coast network", "Award-winning Mileage Plan", "Outstanding customer service"],
        hub: "Seattle-Tacoma International Airport"
    }
]; 