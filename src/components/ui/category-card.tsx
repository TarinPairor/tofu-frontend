import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IconType } from 'react-icons/lib';

interface CategoryCardProps {
  title: string;
  description: string;
  Icon: IconType;
  onClick?: () => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ title, description, Icon, onClick }) => {
  return (
    <Card 
      className="h-[250px] transition-transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <Icon className="w-12 h-12 mx-auto mb-2 text-primary" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
