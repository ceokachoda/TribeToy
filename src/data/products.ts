export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  additional_images?: string[];
  isNew?: boolean;
  isSale?: boolean;
  isPremium?: boolean;
  is_hero?: boolean;
  description?: string;
};

export const products: Product[] = [
  {
    "id": 1,
    "name": "3D Printed Batman Action Figure",
    "category": "Toys & Figurines",
    "price": "₹399.00",
    "image": "/products/batman.jpg",
    "isNew": true,
    "isSale": true,
    "is_hero": true
  },
  {
    "id": 2,
    "name": "3D Printed Goku Super Saiyan Figure",
    "category": "Toys & Figurines",
    "price": "₹499.00",
    "image": "/products/goku.jpg",
    "isNew": false,
    "isSale": false
  },
  {
    "id": 3,
    "name": "3D Printed Kuromi Figure",
    "category": "Toys & Figurines",
    "price": "₹599.00",
    "image": "/products/kuromi.png",
    "isNew": false,
    "isSale": false
  },
  {
    "id": 4,
    "name": "3D Printed Owl Night Lamp",
    "category": "Utility & Decor",
    "price": "₹349.00",
    "image": "/products/owl.jpeg",
    "isNew": true,
    "isSale": false
  },
  {
    "id": 5,
    "name": "New Item 1 (Hexagon Shelf)",
    "category": "Utility & Decor",
    "price": "₹0.00",
    "image": "/products/item-1-1.png",
    "additional_images": ["/products/item-1-2.png"]
  },
  {
    "id": 6,
    "name": "New Item 2 (Teddy Bear)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-2-1.png",
    "additional_images": ["/products/item-2-2.png", "/products/item-2-3.png"]
  },
  {
    "id": 7,
    "name": "New Item 3 (Godzilla Red)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-3-1.png",
    "additional_images": ["/products/item-3-2.png", "/products/item-3-3.png"]
  },
  {
    "id": 8,
    "name": "New Item 4 (Pikachu)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-4-1.png",
    "additional_images": ["/products/item-4-2.png"]
  },
  {
    "id": 9,
    "name": "New Item 5 (Squid Game Guard)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-5-1.png",
    "additional_images": ["/products/item-5-2.png", "/products/item-5-3.png"]
  },
  {
    "id": 10,
    "name": "New Item 6 (Elephant)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-6-1.png",
    "additional_images": ["/products/item-6-2.png"]
  },
  {
    "id": 11,
    "name": "New Item 7 (Spongebob)",
    "category": "Toys & Figurines",
    "price": "₹0.00",
    "image": "/products/item-7-1.png",
    "additional_images": ["/products/item-7-2.png"]
  }
];
