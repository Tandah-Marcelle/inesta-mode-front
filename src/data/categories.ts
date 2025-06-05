import { Category } from '../types';

import roseNoir from '../assets/images/collection rose noir/all miss.jpg';
import homme from '../assets/images/Collection homme/1.jpg';
import dameNature from '../assets/images/collection dame nature/2.jpg';
import enfants from '../assets/images/Children/Fille Inesta/2.jpg';
import marrige from '../assets/images/collection marrige robe blanche/32.jpg';
import sacPerle from '../assets/images/sac perle/5.jpg';
import belleFleure from '../assets/images/collection belle fleur/2.jpg';
import countryFlag from '../assets/images/collection country flag/11.jpg';
import tenuetradi from '../assets/images/mariage coutumier/hatit traditionnel/17.jpg';
import specialMiss from '../assets/images/julia Samantha/15.jpg';



export const categories: Category[] = [
  {
    id: 'rose-noir',
    name: 'Rose Noir',
    description: 'Collection élégante rose noir sophistiquées.',
    image: roseNoir
  },
  {
    id: 'homme',
    name: 'Homme',
    description: 'Collection de vêtements pour hommes stylée pour le gentleman moderne.',
    image: homme
  },
  {
    id: 'dame-nature',
    name: 'Dame Nature',
    description: 'Designs inspirés de la nature célébrant la beauté organique.',
    image: dameNature
  },
  {
    id: 'enfants',
    name: 'Enfants',
    description: 'Adorable collection de vêtements pour enfants.',
    image: enfants
  },
  {
    id: 'marrige',
    name: 'Mariage',
    description: 'Collection nuptiale exquise pour votre jour spécial.',
    image: marrige
  },

  {
<<<<<<< HEAD
    id: 'mariage-coutumier',
    name: 'Tenues Traditionnelles',
    description: 'Collection de tenues traditionnelles pour célébrer la culture.',
    image: marrige
=======
    id: 'special-miss',
    name: 'Special Miss',
    description: 'Collection spéciale pour les reines et les miss.',
    image:specialMiss
>>>>>>> be3abce202b1a6feb4aea255e305b10cd6b3eccf
  },

  {
    id: 'mariage-coutumier',
    name: 'Tenues Traditionnelles',
    description: 'Collection de tenues traditionnelles pour célébrer la culture.',
    image: tenuetradi
  },




  {
    id: 'belle-fleur',
    name: 'Belle Fleure',
    description: 'Collection d’accessoires luxueux ornés de perles.xxxxx',
    image:belleFleure
  },

  {
    id: 'country-flag',
    name: 'Country Flag',
    description: 'Collection d’accessoires luxueux ornés de perles.',
    image:countryFlag
  },



    {
    id: 'sac-perle',
    name: 'Sac Perle',
    description: 'Collection d’accessoires luxueux ornés de perles.',
    image:sacPerle
  },

  //  {
  //   id: 'robe-mixte',
  //   name: 'Autres Robes Mixte',
  //   description: 'Collection d’accessoires luxueux ornés de perles.',
  //   image:robeMixte
  // }
];