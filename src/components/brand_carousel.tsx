import { FiShoppingBag, FiHome, FiSmartphone, FiPackage } from 'react-icons/fi';
import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { CategoryCard } from '@/components/ui/category-card';

const categories = [
  {
    title: 'Fashion and Apparel (Fast Fashion)',
    description: 'Explore sustainable alternatives to fast fashion',
    Icon: FiShoppingBag
  },
  {
    title: 'Personal Care and Household Products',
    description: 'Discover eco-friendly personal care options',
    Icon: FiHome
  },
  {
    title: 'Consumer Electronics',
    description: 'Find sustainable electronics and repair options',
    Icon: FiSmartphone
  },
  {
    title: 'Disposable Consumer Goods',
    description: 'Learn about reusable alternatives',
    Icon: FiPackage
  }
];

export const BrandCarousel = () => {
  const autoplay = useRef(
    Autoplay({ delay: 3800, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1
    },
    [autoplay.current]
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {categories.map((category, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};