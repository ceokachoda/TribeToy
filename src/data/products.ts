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

export const products: Product[] = [
  {
    "id": 1,
    "name": "3D Printed Assamese Fantasy Figurine The Regal Dragon",
    "category": "Toys & Figurines",
    "price": "₹399.00",
    "image": "/products/batman.jpg",
    "isNew": true,
    "isSale": true,
    "is_hero": true
  },
  {
    "id": 2,
    "name": "3D Printed Assamese Souvenir Dhol Pepa Japi Xorai Ensemble",
    "category": "Cultural",
    "price": "₹499.00",
    "image": "/products/goku.jpg",
    "isNew": false,
    "isSale": false
  },
  {
    "id": 3,
    "name": "3D Printed BerryBear Eco Friendly Biopolymer Teddy",
    "category": "Toys & Figurines",
    "price": "₹599.00",
    "image": "/products/kuromi.png",
    "isNew": false,
    "isSale": false
  },
  {
    "id": 4,
    "name": "3D Printed Cartoon Figurine Sponge Bob On The Beach",
    "category": "Toys & Figurines",
    "price": "₹349.00",
    "image": "/products/owl.jpeg",
    "isNew": true,
    "isSale": false
  }
];
