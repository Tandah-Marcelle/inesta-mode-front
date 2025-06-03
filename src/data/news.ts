import { NewsItem } from '../types';
import EVENT1 from '../assets/images/Events/Evenement Public vision award/1.jpg';
import EVENT2 from '../assets/images/Events/Talents et top model/2.jpg';
import EVENT3 from '../assets/images/Events/COMICA Miss cameroun grand centre/1.jpg';

export const newsItems: NewsItem[] = [
  {
    id: 'news001',
    title: 'Evenement Public vision award',
    content: 'Join us for the exclusive unveiling of our Spring 2025 collection. The event will feature a runway show, refreshments, and special early-access discounts for attendees.',
    image: EVENT1,

    date: 'March 15, 2025',
    tags: ['event', 'collection', 'spring']
  },
  {
    id: 'news002',
    title: 'Talents et top model',
    content: 'We are proud to announce our partnership with the TAMO Foundation for their annual charity gala. Inesta Mode will be designing exclusive gowns for the event, with proceeds going to support education initiatives for underprivileged children.',
    image:  EVENT2,
    date: 'April 22, 2025',
    tags: ['charity', 'partnership', 'gala']
  },
    
    {
    id: 'news002',
    title: 'COMICA Miss Cameroun Grand Centre',
    content: 'We are proud to announce our partnership with the TAMO Foundation for their annual charity gala. Inesta Mode will be designing exclusive gowns for the event, with proceeds going to support education initiatives for underprivileged children.',
    image:  EVENT3,
    date: 'April 22, 2025',
    tags: ['charity', 'partnership', 'gala']
  }
]
