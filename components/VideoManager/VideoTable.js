'use client';

import Icon from '@/components/common/Icons';

const VideoTable = ({
  videos,
  onEdit,
  onDelete,
  busy,
}) => {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">

      <table className="w-full table-fixed text-left text-sm">

        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="w-16 p-4">No.</th>
            <th className="w-40 p-4">썸네일</th>
            <th className="p-4">제목</th>
            <th className="w-1/3 p-4">동영상 URL</th>
            <th className="w-28 p-4 text-center">관리</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">

          {videos.map((video, index) => (
            <tr
              key={video.id}
              className="hover:bg-slate-50"
            >
              <td className="p-4 text-slate-500">
                {index + 1}
              </td>

              <td className="p-3">
                <img
                  src={video.thumb_img}
                  alt={video.title}
                  loading="lazy"
                  className="aspect-video w-32 rounded-md bg-slate-100 object-cover"
                />
              </td>

              <td className="break-words p-4 font-medium">
                {video.title}
              </td>

              <td className="p-4">
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <span className="truncate">
                    {video.video_url}
                  </span>

                  <Icon
                    name="external-link"
                    size={14}
                    className="shrink-0"
                  />
                </a>
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-2">

                  <button
                    type="button"
                    onClick={() => onEdit(video)}
                    disabled={busy}
                    title="수정"
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Icon name="pencil" size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(video)}
                    disabled={busy}
                    title="삭제"
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Icon name="trash" size={16} />
                  </button>

                </div>
              </td>
            </tr>
          ))}

          {!videos.length && (
            <tr>
              <td
                colSpan={5}
                className="p-12 text-center text-slate-400"
              >
                등록된 동영상이 없습니다.
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
}

export default VideoTable;
