import { type FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IconType } from 'react-icons/lib';
import { CategoryInformationCard } from './category-information-card';
import { AnimatePresence } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  description: string;
  detailedInformation: string;
  Icon: IconType;
  onHover?: () => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ 
  title, 
  description, 
  detailedInformation, 
  Icon,
  onHover 
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        setShowInfo(true);
        onHover?.();
      }}
      onMouseLeave={() => setShowInfo(false)}
    >
      <AnimatePresence>
        {!showInfo ? (
          <Card className="h-[250px] w-full md:w-[250px] transition-transform hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <Icon className="w-12 h-12 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">{description}</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <CategoryInformationCard
            title={title}
            description={description}
            detailedInformation={detailedInformation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
