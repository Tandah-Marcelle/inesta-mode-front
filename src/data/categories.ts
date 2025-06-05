import { Category } from '../types';

import roseNoir from '../assets/images/collection rose noir/all miss.jpg';
import homme from '../assets/images/Collection homme/1.jpg';
import dameNature from '../assets/images/collection dame nature/2.jpg';
import enfants from '../assets/images/Children/Fille Inesta/2.jpg';
import marrige from '../assets/images/collection marrige robe blanche/32.jpg';
import sacPerle from '../assets/images/sac perle/5.jpg';
import belleFleure from '../assets/images/collection belle fleur/2.jpg';
import countryFlag from '../assets/images/collection country flag/11.jpg';
import tenuetradi from '../assets/images/mariage coutumier/hatit traditionnel/1.jpg';
import specialMiss from '../assets/images/julia Samantha/15.jpg';
import journeeJeunesse from '../assets/images/journee de jeuness/Dress1.jpg';
import robeMixte from '../assets/images/non collection single dresses/Dress5.jpg';



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

    id: 'mariage-coutumier',
    name: 'Tenues Traditionnelles',
    description: 'Collection de tenues traditionnelles pour célébrer la culture.',
    image: tenuetradi
  }
  ,{
    id: 'special-miss',
    name: 'Special Miss',
    description: 'Collection spéciale pour les reines et les miss.',
    image:specialMiss
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

      {
    id: 'journee-jeunesse',
    name: 'Journée de la Jeunesse',
    description: 'Collection d’accessoires luxueux ornés de perles.',
    image:journeeJeunesse
  },

   {
    id: 'robe-mixte',
    name: 'Autres Robes Mixte',
    description: 'Collection d’accessoires luxueux ornés de perles.',
    image:robeMixte
  }
];