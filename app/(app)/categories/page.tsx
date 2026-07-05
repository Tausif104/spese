import { CategoriesView } from "@/components/categories/categories-view";
import { getCategoryList } from "@/lib/data/categories";

export default async function CategoriesPage() {
  const categories = await getCategoryList();
  return <CategoriesView initialCategories={categories} />;
}
