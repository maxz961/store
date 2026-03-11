import { Pencil, Trash2 } from 'lucide-react';
import { s } from './page.styled';
import type { CategoryRowProps } from './page.types';


export const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => (
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
        <button className={s.editBtn} onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </button>
        <button className={s.deleteBtn} onClick={() => onDelete(category.id)}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);
