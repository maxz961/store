'use client';

import { use } from 'react';
import { ProductForm } from '../ProductForm';


const EditProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  return <ProductForm mode="edit" productSlug={slug} />;
};

export default EditProductPage;
