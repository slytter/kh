

type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ImageSize, string> = {
  xs: '50',
  sm: '200',
  md: '600',
  lg: '1000',
  xl: '1400',
};

export const Image = ({ src, alt, className, size}: { src: string, alt: string, className?: string, size?: ImageSize }) => {
  const sizeClass = size ? sizeClasses[size] : sizeClasses.md;
  const transformedSrc = `${src}&w=${sizeClass}&h=${sizeClass}`;

  return <img src={transformedSrc} alt={alt} className={className} />;
};

