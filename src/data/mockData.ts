import { Product, Category, User, Order } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Điện Thoại - Máy Tính Bảng', icon: 'Smartphone', slug: 'dien-thoai' },
  { id: '2', name: 'Điện Tử', icon: 'Laptop', slug: 'dien-tu' },
  { id: '3', name: 'Thời Trang Nam', icon: 'ShirtIcon', slug: 'thoi-trang-nam' },
  { id: '4', name: 'Thời Trang Nữ', icon: 'Shirt', slug: 'thoi-trang-nu' },
  { id: '5', name: 'Mẹ & Bé', icon: 'Baby', slug: 'me-be' },
  { id: '6', name: 'Nhà Cửa & Đời Sống', icon: 'Home', slug: 'nha-cua' },
  { id: '7', name: 'Sách & Tiểu Thuyết', icon: 'Book', slug: 'sach' },
  { id: '8', name: 'Thể Thao & Du Lịch', icon: 'Bike', slug: 'the-thao' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    price: 34990000,
    originalPrice: 36990000,
    discount: 5,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'
    ],
    description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và màn hình Super Retina XDR',
    category: 'dien-thoai',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 2847,
    sold: 1250,
    stock: 50,
    tags: ['hot', 'new'],
    specifications: {
      'Màn hình': '6.7 inch Super Retina XDR',
      'Camera': '48MP + 12MP + 12MP',
      'Chip': 'A17 Pro',
      'RAM': '8GB',
      'Bộ nhớ': '256GB'
    }
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    price: 31990000,
    originalPrice: 33990000,
    discount: 6,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    images: [
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      'https://images.pexels.com/photos/5077404/pexels-photo-5077404.jpeg'
    ],
    description: 'Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và AI Galaxy',
    category: 'dien-thoai',
    brand: 'Samsung',
    rating: 4.7,
    reviewCount: 1893,
    sold: 890,
    stock: 35,
    tags: ['hot'],
    specifications: {
      'Màn hình': '6.8 inch Dynamic AMOLED 2X',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'Chip': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '512GB'
    }
  },
  {
    id: '3',
    name: 'MacBook Air M2 13 inch 256GB',
    price: 27990000,
    originalPrice: 29990000,
    discount: 7,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg'
    ],
    description: 'MacBook Air với chip M2, thiết kế mỏng nhẹ và hiệu năng vượt trội',
    category: 'dien-tu',
    brand: 'Apple',
    rating: 4.9,
    reviewCount: 1456,
    sold: 567,
    stock: 25,
    tags: ['bestseller'],
    specifications: {
      'Màn hình': '13.6 inch Liquid Retina',
      'Chip': 'Apple M2',
      'RAM': '8GB',
      'SSD': '256GB',
      'Pin': 'Lên đến 18 giờ'
    }
  },
  {
    id: '4',
    name: 'Áo Polo Nam Cao Cấp',
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
    images: [
      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
      'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg'
    ],
    description: 'Áo polo nam chất liệu cotton cao cấp, form dáng hiện đại',
    category: 'thoi-trang-nam',
    brand: 'Yapee Fashion',
    rating: 4.5,
    reviewCount: 892,
    sold: 2340,
    stock: 100,
    tags: ['sale'],
    specifications: {
      'Chất liệu': '100% Cotton',
      'Xuất xứ': 'Việt Nam',
      'Size': 'S, M, L, XL, XXL',
      'Màu sắc': 'Đen, Trắng, Xanh navy'
    }
  },
  {
    id: '5',
    name: 'Tai Nghe Bluetooth Sony WH-1000XM5',
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg'
    ],
    description: 'Tai nghe chống ồn hàng đầu với âm thanh Hi-Res và pin 30 giờ',
    category: 'dien-tu',
    brand: 'Sony',
    rating: 4.8,
    reviewCount: 756,
    sold: 445,
    stock: 60,
    tags: ['bestseller'],
    specifications: {
      'Driver': '30mm',
      'Kết nối': 'Bluetooth 5.2',
      'Pin': '30 giờ',
      'Chống ồn': 'Active Noise Cancelling',
      'Trọng lượng': '250g'
    }
  },
  {
    id: '6',
    name: 'Đầm Maxi Nữ Họa Tiết Hoa',
    price: 485000,
    originalPrice: 650000,
    discount: 25,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
      'https://images.pexels.com/photos/1381553/pexels-photo-1381553.jpeg'
    ],
    description: 'Đầm maxi nữ với họa tiết hoa thanh lịch, phù hợp dạo phố và đi chơi',
    category: 'thoi-trang-nu',
    brand: 'Yapee Fashion',
    rating: 4.6,
    reviewCount: 634,
    sold: 1780,
    stock: 80,
    tags: ['trending'],
    specifications: {
      'Chất liệu': 'Voan lụa',
      'Size': 'S, M, L, XL',
      'Màu sắc': 'Hoa đỏ, Hoa xanh, Hoa vàng',
      'Kiểu dáng': 'Maxi dài',
      'Xuất xứ': 'Việt Nam'
    }
  }
];

export const bannerSlides = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
    title: 'Siêu Sale Cuối Năm',
    subtitle: 'Giảm đến 50% cho tất cả sản phẩm',
    link: '/sale'
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg',
    title: 'Công Nghệ Mới Nhất',
    subtitle: 'iPhone 15, MacBook M3 và nhiều hơn nữa',
    link: '/technology'
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg',
    title: 'Thời Trang Thu Đông',
    subtitle: 'Bộ sưu tập mới với styles trending',
    link: '/fashion'
  }
];

export const mockUser: User = {
  id: '1',
  email: 'user@yapee.vn',
  name: 'Nguyễn Văn A',
  role: 'user',
  createdAt: '2024-01-01'
};

export const mockAdmin: User = {
  id: 'admin1',
  email: 'admin@yapee.vn',
  name: 'Admin Yapee',
  role: 'admin',
  createdAt: '2024-01-01'
};

export const companyInfo = {
  name: 'Yapee',
  address: '74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh',
  hotline: '0333.938.014',
  email: {
    support: 'cskh@yapee.vn',
    privacy: 'privacy@yapee.vn'
  },
  workingHours: '8h00 - 19h00, từ Thứ Hai đến Chủ Nhật',
  mission: 'Yapee cung cấp các sản phẩm chất lượng cao với giá cả phải chăng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.',
  vision: 'Yapee hướng tới trở thành thương hiệu mua sắm trực tuyến được yêu thích và tin cậy hàng đầu tại Việt Nam, là lựa chọn ưu tiên của mọi gia đình khi tìm kiếm các sản phẩm chất lượng với giá cả phải chăng.',
  coreValues: [
    'Chất lượng: Không thỏa hiệp về chất lượng từ khâu lựa chọn đến vận chuyển',
    'Giá cả Hợp lý: Cam kết mang đến mức giá cạnh tranh và hợp lý nhất',
    'Khách hàng là Trọng tâm: Mọi quyết định hướng đến sự hài lòng của khách hàng',
    'Đáng tin cậy: Xây dựng niềm tin bằng sự minh bạch và đảm bảo cam kết'
  ]
};