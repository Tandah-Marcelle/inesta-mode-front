export interface Dress {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  new: boolean;
  likes: number;
  liked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  date: string;
  productId: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  tags: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
}