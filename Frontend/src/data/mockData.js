
export const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "Immerse yourself in premium sound quality with these wireless headphones. Features noise cancellation and 20-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.7,
    vendor: {
      id: 1,
      name: "TechGadgets"
    }
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 199.99,
    description: "Stay connected and track your fitness with this advanced smartwatch. Features heart rate monitoring, GPS, and water resistance.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.5,
    vendor: {
      id: 2,
      name: "SmartLife"
    }
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 149.99,
    description: "Work in comfort with this ergonomic office chair. Features adjustable height, lumbar support, and breathable mesh fabric.",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Furniture",
    rating: 4.3,
    vendor: {
      id: 3,
      name: "ComfortZone"
    }
  },
  {
    id: 4,
    name: "Professional DSLR Camera",
    price: 899.99,
    description: "Capture stunning photos and videos with this professional DSLR camera. Features 24.1 megapixels, 4K video recording, and interchangeable lenses.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.8,
    vendor: {
      id: 4,
      name: "PhotoPro"
    }
  },
  {
    id: 5,
    name: "Premium Leather Wallet",
    price: 49.99,
    description: "Organize your essentials with this premium leather wallet. Features multiple card slots, ID window, and slim design.",
    image: "https://images.unsplash.com/photo-1627123039487-5844cd5de03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fashion",
    rating: 4.4,
    vendor: {
      id: 5,
      name: "LuxuryLeather"
    }
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "Stay hydrated with this durable stainless steel water bottle. Features vacuum insulation, keeps drinks cold for 24 hours or hot for 12 hours.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Home",
    rating: 4.6,
    vendor: {
      id: 6,
      name: "EcoEssentials"
    }
  },
  {
    id: 7,
    name: "Wireless Gaming Mouse",
    price: 79.99,
    description: "Dominate your games with this high-performance wireless gaming mouse. Features customizable RGB lighting, 16,000 DPI sensor, and programmable buttons.",
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.7,
    vendor: {
      id: 7,
      name: "GamerGear"
    }
  },
  {
    id: 8,
    name: "Automatic Pour-Over Coffee Maker",
    price: 129.99,
    description: "Enjoy barista-quality coffee at home with this automatic pour-over coffee maker. Features customizable brewing settings and thermal carafe.",
    image: "https://images.unsplash.com/photo-1585687433310-96ae471cf42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Home",
    rating: 4.5,
    vendor: {
      id: 8,
      name: "BrewMaster"
    }
  }
];

export const mockOrders = [
  {
    id: "ORD-001-2023",
    date: "2023-10-15",
    items: [
      { 
        id: 1, 
        name: "Premium Wireless Headphones", 
        price: 299.99, 
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      }
    ],
    total: 299.99,
    status: "Delivered",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    payment: {
      method: "Credit Card",
      cardLast4: "1234"
    }
  },
  {
    id: "ORD-002-2023",
    date: "2023-11-05",
    items: [
      { 
        id: 3, 
        name: "Ergonomic Office Chair", 
        price: 149.99, 
        quantity: 1,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      { 
        id: 5, 
        name: "Premium Leather Wallet", 
        price: 49.99, 
        quantity: 2,
        image: "https://images.unsplash.com/photo-1627123039487-5844cd5de03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      }
    ],
    total: 249.97,
    status: "Shipped",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    payment: {
      method: "PayPal",
      email: "user@example.com"
    }
  },
  {
    id: "ORD-003-2023",
    date: "2023-11-15",
    items: [
      { 
        id: 7, 
        name: "Wireless Gaming Mouse", 
        price: 79.99, 
        quantity: 1,
        image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      }
    ],
    total: 79.99,
    status: "Processing",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001"
    },
    payment: {
      method: "Credit Card",
      cardLast4: "5678"
    }
  }
];

export const mockAddresses = [
  {
    id: 1,
    name: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "555-123-4567",
    isDefault: true
  },
  {
    id: 2,
    name: "Work",
    street: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    phone: "555-987-6543",
    isDefault: false
  }
];

export const mockUser = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  isVendor: false
};
