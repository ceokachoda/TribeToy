export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  isPremium?: boolean;
  is_hero?: boolean;
  description?: string;
};

export const products: Product[] = [];
