
// Mock data for a single model
export const getModelData = (id) => {
  const models = [
    {
      id: 1,
      name: 'Sophia Elegance',
      price: 129.99,
      description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing. A classic addition to any collection.',
      longDescription: 'Sophia Elegance is a masterpiece of craftsmanship, featuring hand-painted details and premium fabric clothing. Each doll is uniquely crafted with attention to the smallest details, from the delicate eyelashes to the perfectly styled hair. The porcelain used is of the highest quality, ensuring a lifelike appearance that will captivate viewers for years to come. The clothing is made from authentic period fabrics, with hand-stitched details that showcase the artistry involved in creating these collectible dolls.',
      image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1625091003965-4d9dea5b1312?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611044318330-9a6e1713d809?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.8,
      reviews: 24,
      inStock: true,
      category: 'Premium',
      specifications: [
        { name: 'Height', value: '18 inches' },
        { name: 'Material', value: 'Porcelain, Fabric' },
        { name: 'Age Range', value: 'Adult Collectors' },
        { name: 'Origin', value: 'Handcrafted in Europe' },
        { name: 'Release Date', value: 'January 2023' },
        { name: 'Limited Edition', value: 'No' },
        { name: 'Articulation', value: 'Fixed pose' },
        { name: 'Hair Type', value: 'Human hair blend' }
      ],
      detailedDescription: "Sophia Elegance represents the pinnacle of doll craftsmanship. Each piece is meticulously crafted by master artisans who have dedicated decades to perfecting their craft. The porcelain is fired at precise temperatures to achieve the perfect translucency and durability. The face painting is done entirely by hand, requiring multiple layers and fine detailing to achieve the lifelike appearance that collectors treasure. The clothing is designed after extensive historical research to ensure period accuracy, with fabrics sourced from specialized mills that create authentic replicas of historical textiles.",
      shippingInfo: {
        dimensions: "20\" x 12\" x 8\"",
        weight: "3.5 lbs",
        handlingTime: "3-5 business days",
        shippingOptions: [
          { method: "Standard", time: "7-10 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "10-14 business days", price: "Free" }
        ],
        specialNotes: "Packaged in a custom protective box with acid-free tissue paper. Certificate of authenticity included."
      },
      customerReviews: [
        { rating: 5, date: "March 12, 2023", comment: "Absolutely stunning craftsmanship. The attention to detail is remarkable, especially in the facial features and costume." },
        { rating: 4, date: "February 18, 2023", comment: "Beautiful addition to my collection. The quality is excellent, though I wish there were more accessory options." },
        { rating: 5, date: "January 30, 2023", comment: "Sophia exceeded my expectations. The porcelain has a wonderful translucency and the costume is historically accurate." }
      ]
    },
    {
      id: 2,
      name: 'Victoria Vintage',
      price: 159.99,
      description: 'Inspired by Victorian era fashion, this doll features authentic period clothing and accessories with incredible attention to detail.',
      longDescription: 'Victoria Vintage captures the elegance and sophistication of the Victorian era with exquisite attention to historical accuracy. Each aspect of this doll has been carefully researched and crafted to represent authentic Victorian fashion and style. From the intricately designed dress with multiple layers of petticoats to the tiny accessories like miniature books and delicate jewelry, every element tells a story of a bygone era. The face is hand-painted with subtle blush tones and features a gentle expression that embodies the refined demeanor of Victorian nobility.',
      image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614344440172-8384ac26984a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1630191071621-171e469e6128?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.9,
      reviews: 36,
      inStock: true,
      category: 'Premium',
      specifications: [
        { name: 'Height', value: '20 inches' },
        { name: 'Material', value: 'Porcelain, Silk, Lace' },
        { name: 'Age Range', value: 'Adult Collectors' },
        { name: 'Origin', value: 'Handcrafted in United Kingdom' },
        { name: 'Release Date', value: 'November 2022' },
        { name: 'Limited Edition', value: 'Yes (500 pieces)' },
        { name: 'Articulation', value: 'Partial (arms and head)' },
        { name: 'Hair Type', value: 'Premium mohair' }
      ],
      detailedDescription: "Victoria Vintage is a meticulous recreation of high Victorian fashion circa 1876. Our research team worked with museum curators to ensure every aspect of the doll's appearance, from the hairstyle to the undergarments, is historically accurate. The silk brocade pattern on the main dress was custom-designed based on textile samples from the period. Each accessory, including the parasol and reticule (small handbag), is fully functional and crafted to scale. The doll features a bisque porcelain head and hands with a cloth body allowing for gentle positioning of the arms.",
      shippingInfo: {
        dimensions: "22\" x 14\" x 10\"",
        weight: "4.2 lbs",
        handlingTime: "5-7 business days",
        shippingOptions: [
          { method: "Standard", time: "7-10 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "10-14 business days", price: "Free" }
        ],
        specialNotes: "Includes display stand and glass dome cover. Ships in reinforced packaging with insurance."
      },
      customerReviews: [
        { rating: 5, date: "April 2, 2023", comment: "As a historian specializing in Victorian fashion, I can attest to the incredible accuracy of this piece. Truly museum quality." },
        { rating: 5, date: "March 15, 2023", comment: "The craftsmanship is extraordinary. Victoria is the centerpiece of my collection now." },
        { rating: 4, date: "February 27, 2023", comment: "Beautiful doll with amazing details. Shipping took longer than expected, but worth the wait." }
      ]
    },
    {
      id: 3,
      name: 'Modern Mila',
      price: 99.99,
      description: 'Contemporary doll design with customizable features and modern fashion elements. Perfect for the trendy collector.',
      longDescription: 'Modern Mila represents the cutting edge of contemporary doll design, featuring customizable elements and fashion-forward styling. With her trendy outfit and modern aesthetic, Mila appeals to collectors who appreciate current fashion trends and artistic innovation. The doll features a unique posable design that allows for creative positioning and display options.',
      image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586044761514-7d979c9e90dc?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598256196200-224ffe6e39de?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.7,
      reviews: 19,
      inStock: true,
      category: 'Standard',
      specifications: [
        { name: 'Height', value: '16 inches' },
        { name: 'Material', value: 'Vinyl, Synthetic Fabric' },
        { name: 'Age Range', value: 'Teen and Adult Collectors' },
        { name: 'Origin', value: 'Designed in USA, Made in Japan' },
        { name: 'Release Date', value: 'March 2023' },
        { name: 'Limited Edition', value: 'No' },
        { name: 'Articulation', value: 'Fully posable (11 points)' },
        { name: 'Hair Type', value: 'Changeable wigs (2 included)' }
      ],
      detailedDescription: "Modern Mila is the result of collaboration between fashion designers and doll artists, creating a piece that bridges the worlds of collectibles and contemporary style. Her wardrobe includes pieces inspired by current runway trends, scaled perfectly and constructed with the same attention to detail as their full-sized counterparts. The innovative joint system allows for natural posing while maintaining the aesthetic appeal of the doll. Mila comes with two interchangeable wigs and a fashion accessory set that allows collectors to create multiple looks.",
      shippingInfo: {
        dimensions: "18\" x 10\" x 6\"",
        weight: "2.8 lbs",
        handlingTime: "1-3 business days",
        shippingOptions: [
          { method: "Standard", time: "5-7 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "7-14 business days", price: "Free" }
        ],
        specialNotes: "Comes with display stand and fashion lookbook. Additional outfit sets available separately."
      },
      customerReviews: [
        { rating: 5, date: "April 10, 2023", comment: "Love the contemporary vibe of this doll! The changeable wigs and posability make her super versatile for photography." },
        { rating: 4, date: "March 25, 2023", comment: "Really cool design and concept. Would love to see more outfit options in the future." },
        { rating: 5, date: "March 18, 2023", comment: "The attention to detail on the miniature clothing is incredible! Each piece is perfectly scaled and on-trend." }
      ]
    }
  ];
  
  return models.find(model => model.id === parseInt(id)) || null;
};

// Get related models based on category
export const getRelatedModels = (currentModelId, category) => {
  const allModels = [
    {
      id: 1,
      name: 'Sophia Elegance',
      price: 129.99,
      description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing.',
      image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 2,
      name: 'Victoria Vintage',
      price: 159.99,
      description: 'Inspired by Victorian era fashion with authentic period clothing.',
      image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 3,
      name: 'Modern Mila',
      price: 99.99,
      description: 'Contemporary doll design with customizable features and modern fashion elements.',
      image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
      category: 'Standard'
    },
    {
      id: 4,
      name: 'Elegant Eleanor',
      price: 149.99,
      description: 'Elegant porcelain doll with handcrafted lace details and satin finish.',
      image: 'https://images.unsplash.com/photo-1590072060877-89cdc8ab5524?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 5,
      name: 'Classic Charlotte',
      price: 119.99,
      description: 'Traditional design with timeless appeal, featuring hand-painted features.',
      image: 'https://images.unsplash.com/photo-1566512772618-ddecb1492ee9?q=80&w=1000&auto=format&fit=crop',
      category: 'Standard'
    },
    {
      id: 6,
      name: 'Retro Rebecca',
      price: 139.99,
      description: 'Vintage-inspired model with authentic mid-century styling and accessories.',
      image: 'https://images.unsplash.com/photo-1597046510717-b0ffd88d592d?q=80&w=1000&auto=format&fit=crop',
      category: 'Limited Edition'
    }
  ];
  
  return allModels
    .filter(model => model.id !== parseInt(currentModelId) && model.category === category)
    .slice(0, 3);
};
