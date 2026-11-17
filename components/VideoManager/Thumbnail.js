import { useState } from 'react';
import Icon from '@/components/common/Icons';
const Thumbnail = ({ src, title }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="
      flex aspect-video w-full items-center
      justify-center overflow-hidden
      rounded-lg bg-slate-100
    ">
      {src && !failed && isValidUrl(src) ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon
          name="image-off"
          size={24}
          className="text-slate-400"
        />
      )}
    </div>
  );
}

export default Thumbnail;
