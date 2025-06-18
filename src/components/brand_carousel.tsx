import { FiShoppingBag, FiHome, FiSmartphone, FiPackage } from 'react-icons/fi';
import { useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { CategoryCard } from '@/components/ui/category-card';
import { CategoryInformationCard } from '@/components/ui/category-information-card';
import { AnimatePresence, motion } from 'framer-motion';

const categories = [
	{
		title: 'Fashion and Apparel (Fast Fashion)',
		description: 'Explore sustainable fashion alternatives',
		detailedInformation: `The fashion industry is responsible for 20% of global wastewater and is the second-largest consumer of water worldwide. Only 12% of clothing materials are recycled, and millions of tons of returned or unsold garments end up in landfills annually.

    Key Issues:
    • Fast fashion's rapid production cycle leads to excessive waste
    • Synthetic textiles shed microplastics during washing
    • Huge water consumption in textile production
    • Poor working conditions in many manufacturing facilities
    
    What You Can Do:
    • Choose quality over quantity
    • Buy from sustainable brands
    • Consider second-hand clothing
    • Properly care for your clothes to extend their life`,
		Icon: FiShoppingBag,
	},
	{
		title: 'Personal Care and Household Products',
		description: 'Discover eco-friendly personal care options',
		detailedInformation: `Personal care and household products often contain harmful chemicals and come in single-use plastic packaging. Many products contain microbeads and other pollutants that harm aquatic ecosystems.

    Key Issues:
    • Excessive plastic packaging waste
    • Harmful chemicals in products
    • Animal testing concerns
    • Water pollution from chemical runoff
    
    Sustainable Alternatives:
    • Choose products with minimal packaging
    • Use natural and organic ingredients
    • Support cruelty-free brands
    • Consider making your own products`,
		Icon: FiHome,
	},
	{
		title: 'Consumer Electronics',
		description: 'Find sustainable electronics and repair options',
		detailedInformation: `Electronic waste is one of the fastest-growing waste streams globally. Many devices are designed to be replaced rather than repaired, leading to unnecessary waste and resource consumption.

    Key Concerns:
    • Rapid obsolescence of devices
    • Difficult or impossible to repair
    • Toxic materials in electronics
    • High energy consumption
    
    Sustainable Practices:
    • Choose repairable devices
    • Extend device lifespan through maintenance
    • Properly recycle old electronics
    • Consider refurbished options`,
		Icon: FiSmartphone,
	},
	{
		title: 'Disposable Consumer Goods',
		description: 'Learn about reusable alternatives',
		detailedInformation: `Single-use and disposable products contribute significantly to landfill waste and ocean pollution. Many of these items take hundreds of years to decompose.

    Common Issues:
    • Short lifespan of products
    • Excessive packaging waste
    • Ocean pollution from disposables
    • Resource-intensive production
    
    Sustainable Solutions:
    • Choose reusable alternatives
    • Support zero-waste products
    • Minimize packaging waste
    • Invest in durable goods`,
		Icon: FiPackage,
	},
];

export const BrandCarousel = () => {
	const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
	const autoplayPlugin = useRef(
		Autoplay({
			delay: 2000,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			playOnInit: true,
		})
	);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: 'start',
			slidesToScroll: 1,
		},
		[autoplayPlugin.current]
	);

	const handleCardHover = (index: number) => {
		if (emblaApi) {
			autoplayPlugin.current.stop();
		}
		setHoveredCategory(index);
	};

	const handleMouseLeave = () => {
		if (emblaApi) {
			autoplayPlugin.current.play();
		}
		setHoveredCategory(null);
	};

	return (
		<div className="w-full max-w-5xl mx-auto px-4">
			<AnimatePresence mode="wait" initial={false}>
				{hoveredCategory === null ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8, ease: 'easeInOut' }}
						className="overflow-hidden"
						ref={emblaRef}
					>
						<div className="flex">
							{categories.map((category, index) => (
								<div
									key={index}
									className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
								>
									<CategoryCard
										{...category}
										onHover={() => handleCardHover(index)}
									/>
								</div>
							))}
						</div>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8, ease: 'easeInOut' }}
						onMouseLeave={handleMouseLeave}
					>
						<CategoryInformationCard
							{...categories[hoveredCategory]}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};