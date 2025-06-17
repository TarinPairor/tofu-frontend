import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IconType } from 'react-icons/lib';

interface CategoryCardProps {
  title: string;
  description: string;
  Icon: IconType;
}

export const CategoryCard: FC<CategoryCardProps> = ({ title, description, Icon }) => {
  return (
    <Card className="h-[250px]">
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
