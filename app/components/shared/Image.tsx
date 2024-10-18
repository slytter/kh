type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ImageSize, string> = {
  xs: '50',
  sm: '200',
  md: '600',
  lg: '1000',
  xl: '1400',
};

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
  size?: ImageSize;
}

export const transformSrc = (src: string, size?: ImageSize) => {
  const sizeClass = size ? sizeClasses[size] : sizeClasses.lg;
  return `${src}?w=${sizeClass}&h=${sizeClass}`;
}

export const Image = ({ src, alt, className, style, height, width, size}: ImageProps) => {
  const transformedSrc = transformSrc(src, size);

  return <img
    src={transformedSrc}
    alt={alt}
    className={className}
    style={style}
    width={width}
    height={height}
  />;
};

