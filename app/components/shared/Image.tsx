type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ImageSize, string> = {
  xs: '100',
  sm: '300',
  md: '600',
  lg: '1000',
  xl: '1400',
};

interface ImageProps extends React.ComponentProps<'img'> {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
  size?: ImageSize;
}

const transformBunnyCDN = (src: string, resize: ImageSize) => {
  if(src.includes('b-cdn')) {
    const isDev = src.includes('/dev/')
    const base = 'https://kh.imgix.net/' + (isDev ? 'dev/' : '')
    const imagePath = src.split('/').pop()
    const transformations = `?w=${sizeClasses[resize]}`
    const newPath = base + imagePath + transformations    

    return newPath;
  }
  return src;
}

const transformUploadCare = (src: string, resize: ImageSize) => {
  if(src.includes('ucarecdn')) {
    return src + '/-/preview/-/resize/x' + sizeClasses[resize] + '/'
  }
  return src;
}


export const transformSrc = (src: string, size?: ImageSize) => {
  src = transformBunnyCDN(src, size || 'lg');
  src = transformUploadCare(src, size || 'lg');
  const sizeClass = size ? sizeClasses[size] : sizeClasses.lg;
  return `${src}?w=${sizeClass}&h=${sizeClass}`;
}

export const Image = ({ src, alt, className, style, height, width, size, ...props }: ImageProps) => {
  const transformedSrc = transformSrc(src, size);

  return <img
    src={transformedSrc}
    alt={alt}
    className={className}
    style={style}
    width={width}
    height={height}
    {...props}
  />;
};

