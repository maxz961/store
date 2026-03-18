'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { ImageThumb } from './ImageThumb';
import type { ImageUploadProps } from './ImageUpload.types';
import { MAX_FILE_SIZE } from './ImageUpload.constants';
import { s } from './ImageUpload.styled';


const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

export const ImageUpload = ({
  files,
  existingUrls = [],
  onChange,
  onRemoveExisting,
  maxFiles = 6,
}: ImageUploadProps) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCount = files.length + existingUrls.length;
  const canAdd = totalCount < maxFiles;

  const fileUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const all = Array.from(newFiles);

    const tooLarge = all.filter((f) => f.type.startsWith('image/') && f.size > MAX_FILE_SIZE);
    const wrongType = all.filter((f) => !f.type.startsWith('image/'));
    const valid = all.filter(
      (f) => f.type.startsWith('image/') && f.size <= MAX_FILE_SIZE,
    );

    const remaining = maxFiles - totalCount;
    const overLimit = valid.length > remaining;
    const toAdd = valid.slice(0, remaining);

    const errors: string[] = [];
    if (tooLarge.length > 0) {
      const names = tooLarge.map((f) => f.name).join(', ');
      errors.push(t('imageUpload.errorTooLarge').replace('{max}', String(MAX_FILE_SIZE_MB)).replace('{names}', names));
    }
    if (wrongType.length > 0) {
      errors.push(t('imageUpload.errorWrongType'));
    }
    if (overLimit) {
      errors.push(t('imageUpload.errorOverLimit').replace('{remaining}', String(remaining)).replace('{max}', String(maxFiles)));
    }

    setError(errors.length > 0 ? errors.join('. ') : null);

    if (toAdd.length > 0) {
      onChange([...files, ...toAdd]);
    }
  }, [files, totalCount, maxFiles, onChange, t]);

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

  const handleTriggerInput = () => inputRef.current?.click();

  return (
    <div className={s.container}>
      <When condition={totalCount > 0}>
        <div className={s.thumbnails}>
          {existingUrls.map((url) => (
            <ImageThumb key={url} src={url} onRemove={removeExisting(url)} />
          ))}
          {fileUrls.map((url, index) => (
            <ImageThumb key={url} src={url} onRemove={removeFile(index)} />
          ))}
        </div>
      </When>

      <When condition={canAdd}>
        <div
          className={cn(s.dropzone, isDragging && s.dropzoneActive)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleTriggerInput}
        >
          <ImagePlus className={s.dropzoneIcon} />
          <p className={s.dropzoneText}>{t('imageUpload.addPhoto')}</p>
          <p className={s.dropzoneHint}>{t('imageUpload.hint').replace('{max}', String(MAX_FILE_SIZE_MB))}</p>
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

      <When condition={!!error}>
        <p className={s.error} role="alert">{error}</p>
      </When>
    </div>
  );
};
