'use client';

import Icon from '@/components/common/Icons';

const VideoList = ({
  videos,
  onEdit,
  onDelete,
  busy,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 lg:hidden">

      {videos.map((video) => (
        <article
          key={video.id}
          className="
            flex items-center gap-3 rounded-xl
            border border-slate-200 bg-white p-3
            shadow-sm sm:gap-5 sm:p-4
          "
        >
          {/* Thumbnail */}
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-28 shrink-0 sm:w-48"
          >
            <img
              src={video.thumb_img}
              alt={video.title}
              loading="lazy"
              className="aspect-video w-full rounded-lg bg-slate-100 object-cover"
            />
          </a>

          {/* Content */}
          <div className="min-w-0 flex-1">

            <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
              {video.title}
            </h3>

            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-xs text-blue-600"
            >
              <span className="truncate">
                {video.video_url}
              </span>

              <Icon
                name="external-link"
                size={12}
                className="shrink-0"
              />
            </a>

            {/* Actions */}
            <div className="mt-3 flex gap-2">

              <button
                onClick={() => onEdit(video)}
                disabled={busy}
                className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs text-blue-600 disabled:opacity-50"
              >
                <Icon name="pencil" size={13} />
                수정
              </button>

              <button
                onClick={() => onDelete(video)}
                disabled={busy}
                className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600 disabled:opacity-50"
              >
                <Icon name="trash" size={13} />
                삭제
              </button>

            </div>
          </div>
        </article>
      ))}

      {!videos.length && (
        <div className="flex flex-col items-center rounded-xl border bg-white p-10 text-slate-400">
          <Icon name="video" size={32} />
          <p className="mt-3 text-sm">
            등록된 동영상이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoList;
