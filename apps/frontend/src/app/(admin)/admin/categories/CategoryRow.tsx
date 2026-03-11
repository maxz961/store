import { Pencil, Trash2 } from 'lucide-react';
import { s } from './page.styled';
import type { CategoryRowProps } from './page.types';


export const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => {
  const handleEdit = () => onEdit(category);
  const handleDelete = () => onDelete(category.id);

  return (
    <tr className={s.tr}>
      <td className={s.td}>
        <p className={s.name}>{category.name}</p>
        <p className={s.slug}>{category.slug}</p>
      </td>
      <td className={s.tdCenter}>
        <span className={s.count}>{category._count?.products ?? 0}</span>
      </td>
      <td className={s.tdCenter}>
        <div className={s.actions}>
          <button className={s.editBtn} onClick={handleEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button className={s.deleteBtn} onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
