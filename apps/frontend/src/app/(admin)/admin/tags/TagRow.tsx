import { Pencil, Trash2 } from 'lucide-react';
import { When } from 'react-if';
import { s } from './page.styled';
import type { TagRowProps } from './page.types';


export const TagRow = ({ tag, onEdit, onDelete }: TagRowProps) => {
  const handleEdit = () => onEdit(tag);
  const handleDelete = () => onDelete(tag);

  return (
    <tr className={s.tr}>
      <td className={s.td}>
        <div className={s.nameCell}>
          <When condition={!!tag.color}>
            <span className={s.colorDot} style={{ backgroundColor: tag.color ?? undefined }} />
          </When>
          <div>
            <p className={s.name}>{tag.name}</p>
            <p className={s.slug}>{tag.slug}</p>
          </div>
        </div>
      </td>
      <td className={s.tdCenter}>
        <span className={s.count}>{tag._count?.products ?? 0}</span>
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
