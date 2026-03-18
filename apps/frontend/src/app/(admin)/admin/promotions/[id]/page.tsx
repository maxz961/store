'use client';

import { useParams } from 'next/navigation';
import { PromotionForm } from '../new/PromotionForm';


const EditPromotionPage = () => {
  const { id } = useParams<{ id: string }>();
  return <PromotionForm promotionId={id} />;
};

export default EditPromotionPage;
