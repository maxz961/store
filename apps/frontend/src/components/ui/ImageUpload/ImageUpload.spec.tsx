import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'uk', t: (k: string) => k }),
}));

jest.mock('lucide-react', () => ({
  ImagePlus: (props: any) => <div data-testid="icon-image-plus" {...props} />,
  X: (props: any) => <div data-testid="icon-x" {...props} />,
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

let blobCounter = 0;

beforeEach(() => {
  blobCounter = 0;
  global.URL.createObjectURL = jest.fn(
    () => `blob:http://localhost/${++blobCounter}`,
  );
  global.URL.revokeObjectURL = jest.fn();
});

import { ImageUpload } from './ImageUpload';


const createFile = (name: string, size = 1024): File =>
  new File(['x'.repeat(size)], name, { type: 'image/png' });

const getImages = () => document.querySelectorAll<HTMLImageElement>('img');

describe('ImageUpload', () => {
  it('renders dropzone when no files', () => {
    render(<ImageUpload files={[]} onChange={jest.fn()} />);
    expect(screen.getByText('imageUpload.addPhoto')).toBeInTheDocument();
  });

  it('displays thumbnails for selected files', () => {
    const file1 = createFile('photo1.png');
    const file2 = createFile('photo2.png');

    render(<ImageUpload files={[file1, file2]} onChange={jest.fn()} />);

    const images = getImages();
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'blob:http://localhost/1');
    expect(images[1]).toHaveAttribute('src', 'blob:http://localhost/2');
  });

  it('uses stable blob URLs across re-renders with same reference', () => {
    const files = [createFile('photo.png')];
    const { rerender } = render(
      <ImageUpload files={files} onChange={jest.fn()} />,
    );

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);

    // Re-render with same files array reference — should NOT create new URLs
    rerender(<ImageUpload files={files} onChange={jest.fn()} />);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when files are selected via input', () => {
    const onChange = jest.fn();
    render(<ImageUpload files={[]} onChange={onChange} />);

    const input = document.querySelector('input[type="file"]')!;
    const file = createFile('new.png');

    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('removes file when X button clicked', () => {
    const file1 = createFile('a.png');
    const file2 = createFile('b.png');
    const onChange = jest.fn();

    render(<ImageUpload files={[file1, file2]} onChange={onChange} />);

    const removeButtons = screen.getAllByTestId('icon-x');
    fireEvent.click(removeButtons[0].closest('button')!);

    expect(onChange).toHaveBeenCalledWith([file2]);
  });

  it('respects maxFiles limit', () => {
    const files = [createFile('1.png'), createFile('2.png')];
    render(<ImageUpload files={files} onChange={jest.fn()} maxFiles={2} />);

    expect(screen.queryByText('imageUpload.addPhoto')).not.toBeInTheDocument();
  });

  it('defaults maxFiles to 6', () => {
    const files = Array.from({ length: 5 }, (_, i) => createFile(`${i}.png`));
    render(<ImageUpload files={files} onChange={jest.fn()} />);

    expect(screen.getByText('imageUpload.addPhoto')).toBeInTheDocument();
  });

  it('displays existing URL thumbnails', () => {
    const existingUrls = ['https://example.com/img1.jpg'];
    render(
      <ImageUpload
        files={[]}
        existingUrls={existingUrls}
        onChange={jest.fn()}
      />,
    );

    const images = getImages();
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/img1.jpg');
  });

  it('revokes blob URLs on unmount', () => {
    const file = createFile('photo.png');
    const { unmount } = render(
      <ImageUpload files={[file]} onChange={jest.fn()} />,
    );

    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/1');
  });

  it('shows error when file exceeds size limit', () => {
    const largeFile = new File(['x'.repeat(100)], 'huge.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    render(<ImageUpload files={[]} onChange={jest.fn()} />);

    const input = document.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent('imageUpload.errorTooLarge');
  });

  it('shows error when file type is not supported', () => {
    const pdfFile = new File(['data'], 'doc.pdf', { type: 'application/pdf' });

    render(<ImageUpload files={[]} onChange={jest.fn()} />);

    const input = document.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [pdfFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent('imageUpload.errorWrongType');
  });
});
