import { Pencil, Trash2 } from 'lucide-react';
import { When } from 'react-if';
import { s } from './page.styled';
import type { TagRowProps } from './page.types';


export const TagRow = ({ tag, onEdit, onDelete }: TagRowProps) => (
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
        <button className={s.editBtn} onClick={() => onEdit(tag)}>
          <Pencil className="h-4 w-4" />
        </button>
        <button className={s.deleteBtn} onClick={() => onDelete(tag.id)}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);
