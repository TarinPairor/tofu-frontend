import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion';

interface CategoryInformationCardProps {
  title: string;
  description: string;
  detailedInformation: string;
}

export const CategoryInformationCard: FC<CategoryInformationCardProps> = ({
  title,
  description,
  detailedInformation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <CardDescription className="text-center text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-base leading-relaxed">
          {detailedInformation}
        </CardContent>
      </Card>
    </motion.div>
  );
};
