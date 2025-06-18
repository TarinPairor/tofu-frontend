import { FiShoppingBag, FiHome, FiSmartphone, FiPackage } from 'react-icons/fi';
import { useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { CategoryCard } from '@/components/ui/category-card';

const categories = [
  {
    title: 'Fashion and Apparel (Fast Fashion)',
    description: `Textile Waste: The fashion industry is responsible for 20% of global wastewater 
    and is the second-largest consumer of water worldwide. Only 12% of clothing materials are 
    recycled, and millions of tons of returned or unsold garments end up in landfills annually.

    Microplastics: Synthetic textiles like polyester shed microplastics during washing, accounting 
    for nearly 35% of primary microplastics in the ocean.`,
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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3800,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1
    },
    [autoplayPlugin.current]
  );

  const handleCardClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      autoplayPlugin.current.stop();
    }
    setSelectedCategory(index);
  };

  const handleCloseInfo = () => {
    setSelectedCategory(null);
    if (emblaApi) {
      autoplayPlugin.current.play();
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <CategoryCard 
                  {...category} 
                  onClick={() => handleCardClick(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory !== null && (
        <CategoryInformationCard
          {...categories[selectedCategory]}
          isOpen={true}
          onClose={handleCloseInfo}
        />
      )}
    </>
  );
};