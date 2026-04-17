export const CATEGORIES = [
  { id: 'amazing-pools', name: 'Amazing pools', icon: 'Waves' },
  { id: 'beachfront', name: 'Beachfront', icon: 'Umbrella' },
  { id: 'cabins', name: 'Cabins', icon: 'Home' },
  { id: 'omg', name: 'OMG!', icon: 'Ghost' },
  { id: 'trending', name: 'Trending', icon: 'Flame' },
  { id: 'islands', name: 'Islands', icon: 'Palmtree' },
  { id: 'mansions', name: 'Mansions', icon: 'Castle' },
  { id: 'lakefront', name: 'Lakefront', icon: 'Ship' },
  { id: 'surfing', name: 'Surfing', icon: 'Wind' },
  { id: 'luxe', name: 'Luxe', icon: 'Gem' },
  { id: 'farms', name: 'Farms', icon: 'Tractor' },
  { id: 'desert', name: 'Desert', icon: 'Sun' },
  { id: 'arctic', name: 'Arctic', icon: 'Snowflake' },
];

const generateListingsForCategory = (categoryId, categoryName, count = 25) => {
  const locations = [
    "Goa, India", "Rishikesh, India", "Udaipur, India", "Manali, India", "Munnar, India",
    "Pondicherry, India", "Gulmarg, India", "Vagamon, India", "Coorg, India", "Alleppey, India",
    "Varanasi, India", "Leh, India", "Shimla, India", "Jaipur, India", "Darjeeling, India"
  ];
  const descriptions = [
    "Mountains and valleys view", "Beachfront villa with pool", "In the heart of coffee plantation",
    "Ganga view luxury stay", "Royal palace experience", "Starlit sky and rugged mountains",
    "Luxury houseboat on backwaters", "Snowy peak view cottage", "Cloud-kissed tea gardens",
    "Ancient city spiritual retreat", "French colony vibes", "Skiing and snow mountains"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const location = locations[i % locations.length];
    const description = descriptions[i % descriptions.length];
    return {
      id: `${categoryId}-${i}`,
      title: location,
      description: `${categoryName}: ${description}`,
      price: 3000 + (Math.floor(Math.random() * 20) * 500),
      rating: 4.5 + (Math.random() * 0.5),
      images: [
        `https://picsum.photos/seed/${categoryId}-${i}a/600/600`,
        `https://picsum.photos/seed/${categoryId}-${i}b/600/600`,
        `https://picsum.photos/seed/${categoryId}-${i}c/600/600`
      ],
      date: `${10 + (i % 20)}-${15 + (i % 20)} Oct`,
      category: categoryId
    };
  });
};

export const LISTINGS = CATEGORIES.flatMap(cat => generateListingsForCategory(cat.id, cat.name, 25));
