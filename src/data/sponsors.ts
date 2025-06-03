import { Sponsor } from '../types';
import AFDEEF from '../assets/images/sponsors/AFDEEFjpg.jpg';
import TAMO from '../assets/images/sponsors/TAMO.jpg';

export const sponsors: Sponsor[] = [
  {
    id: 'sp001',
    name: "Association des Femmes Dynamiques Engagées pour l'Epanouissement de la Famille (AFDEEF)",
    description: "L' association AFDEEF est un groupe de femmes dynamiques, ambitieuses et persévérantes, venant d'horizons différents qui ont décidé mettre leurs connaissances en commun afin de lutter contre tous obstacles entravant le bien être mental ainsi que l'épanouissement de la femme,  de sa famille et son entourage.",
    logo: AFDEEF,
    website: ''
  },
  {
    id: 'sp002',
    name: 'Technological Aid for Minorities Outcries (TAMO Secures)',
    description: 'Nous luttons contre la violence basée sur le genre avec TAMO Secures, une solution logicielle innovante. Notre mission est de sensibiliser et de premouvoir le changement en utilisant la technologie pour protéger et autonomiser les femmes et jeunes filles',
    logo: TAMO ,
    website: ''
  },

];