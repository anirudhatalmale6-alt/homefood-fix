/** 10 featured dishes — images from `public/menu/dish-1.png` … `dish-10.png` */
export type MenuCarouselItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  imageAlt: string
  badge?: string
}

export const MENU_CAROUSEL_ITEMS: MenuCarouselItem[] = [
  {
    id: 'd1',
    name: 'Sunday Pot Roast',
    description: 'Slow-braised beef, root vegetables, rich gravy.',
    price: '$16.99',
    image: '/menu/dish-1.png',
    imageAlt: 'Pot roast with vegetables',
    badge: 'Popular',
  },
  {
    id: 'd2',
    name: 'Herb-Roasted Chicken',
    description: 'Half bird, garlic-herb butter, seasonal veg.',
    price: '$14.50',
    image: '/menu/dish-2.png',
    imageAlt: 'Roasted chicken with herbs',
  },
  {
    id: 'd3',
    name: 'Garden Lasagna',
    description: 'House marinara, ricotta, spinach, mozzarella.',
    price: '$13.25',
    image: '/menu/dish-3.png',
    imageAlt: 'Baked lasagna',
  },
  {
    id: 'd4',
    name: 'Citrus Glazed Salmon',
    description: 'Jasmine rice and seasonal greens.',
    price: '$18.00',
    image: '/menu/dish-4.png',
    imageAlt: 'Glazed salmon plate',
  },
  {
    id: 'd5',
    name: 'BBQ Pulled Pork',
    description: 'House slaw, pickles, brioche on the side.',
    price: '$15.00',
    image: '/menu/dish-5.png',
    imageAlt: 'Pulled pork plate',
  },
  {
    id: 'd6',
    name: 'Maple Roasted Carrots',
    description: 'Thyme, toasted pecans, brown butter.',
    price: '$5.50',
    image: '/menu/dish-6.png',
    imageAlt: 'Roasted carrots',
    badge: 'Fresh',
  },
  {
    id: 'd7',
    name: 'Creamy Mashed Potatoes',
    description: 'Whipped with butter and chives.',
    price: '$4.75',
    image: '/menu/dish-7.png',
    imageAlt: 'Mashed potatoes',
  },
  {
    id: 'd8',
    name: 'Brown Butter Cobbler',
    description: 'Seasonal fruit, vanilla, warm spice.',
    price: '$6.25',
    image: '/menu/dish-8.png',
    imageAlt: 'Fruit cobbler dessert',
  },
  {
    id: 'd9',
    name: 'House Mint Lemonade',
    description: 'Small batch, lightly sweetened.',
    price: '$3.50',
    image: '/menu/dish-9.png',
    imageAlt: 'Mint lemonade',
  },
  {
    id: 'd10',
    name: 'Family Feast Tray',
    description: 'Chef’s pick proteins, two sides, feeds 4–6.',
    price: '$54.00',
    image: '/menu/dish-10.png',
    imageAlt: 'Family meal tray',
  },
]
