import { FiShoppingBag, FiHome, FiSmartphone, FiPackage } from 'react-icons/fi';
import Carousel from '@/blocks/Components/Carousel/Carousel';

const items = [
  {
    id: 1,
    title: 'Fashion and Apparel (Fast Fashion)',
    description: 'Explore sustainable alternatives to fast fashion',
    icon: <FiShoppingBag className="carousel-icon" />
  },
  {
    id: 2,
    title: 'Personal Care and Household Products',
    description: 'Discover eco-friendly personal care options',
    icon: <FiHome className="carousel-icon" />
  },
  {
    id: 3,
    title: 'Consumer Electronics',
    description: 'Find sustainable electronics and repair options',
    icon: <FiSmartphone className="carousel-icon" />
  },
  {
    id: 4,
    title: 'Disposable Consumer Goods',
    description: 'Learn about reusable alternatives',
    icon: <FiPackage className="carousel-icon" />
  }
];

export const BrandCarousel = () => {
  return (
    <div className="flex justify-center items-center w-full overflow-hidden">
      <div className="w-full" style={{ maxWidth: "calc(400px + 32px)" }}>
        <Carousel
          items={items}
          baseWidth={400}
          autoplay={true}
          autoplayDelay={2500}
          loop={true}
        />
      </div>
    </div>
  );
};