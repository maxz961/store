'use client';

import { useState, useRef, useCallback } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import type { ImageUploadProps } from './ImageUpload.types';
import { MAX_FILE_SIZE } from './ImageUpload.constants';
import { s } from './ImageUpload.styled';

export const ImageUpload = ({
  files,
  existingUrls = [],
  onChange,
  onRemoveExisting,
  maxFiles = 5,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalCount = files.length + existingUrls.length;
  const canAdd = totalCount < maxFiles;

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const valid = Array.from(newFiles).filter(
      (f) => f.type.startsWith('image/') && f.size <= MAX_FILE_SIZE,
    );
    const remaining = maxFiles - totalCount;
    const toAdd = valid.slice(0, remaining);
    if (toAdd.length > 0) {
      onChange([...files, ...toAdd]);
    }
  }, [files, totalCount, maxFiles, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  }, [addFiles]);

  const removeFile = useCallback((index: number) => () => {
    onChange(files.filter((_, i) => i !== index));
  }, [files, onChange]);

  const removeExisting = useCallback((url: string) => () => {
    onRemoveExisting?.(url);
  }, [onRemoveExisting]);

  return (
    <div className={s.container}>
      <When condition={totalCount > 0}>
        <div className={s.thumbnails}>
          {existingUrls.map((url) => (
            <div key={url} className={s.thumb}>
              <img src={url} alt="" className={s.thumbImage} />
              <button className={s.thumbRemove} onClick={removeExisting(url)} type="button">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={s.thumb}>
              <img src={URL.createObjectURL(file)} alt="" className={s.thumbImage} />
              <button className={s.thumbRemove} onClick={removeFile(index)} type="button">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </When>

      <When condition={canAdd}>
        <div
          className={cn(s.dropzone, isDragging && s.dropzoneActive)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className={s.dropzoneIcon} />
          <p className={s.dropzoneText}>Добавить фото</p>
          <p className={s.dropzoneHint}>JPG, PNG или WebP, до 5 МБ</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </When>
    </div>
  );
};
