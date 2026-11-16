'use client';

import { Plus, Save, X } from 'lucide-react';

export default function VideoForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingId,
  saving,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputClass = `
    w-full rounded-lg border border-slate-300
    bg-white px-3 py-2.5 text-sm outline-none
    focus:border-blue-500 focus:ring-2
    focus:ring-blue-100
  `;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold">
        {editingId ? '동영상 수정' : '동영상 등록'}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Title */}
        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">
            제목
          </label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="동영상 제목을 입력하세요"
            className={inputClass}
            required
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            동영상 URL
          </label>

          <input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            className={inputClass}
            required
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            썸네일 URL
          </label>

          <input
            type="url"
            name="thumb_img"
            value={formData.thumb_img}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
            required
          />
        </div>

        {/* Thumbnail Preview */}
        {formData.thumb_img && (
          <div className="lg:col-span-2">
            <p className="mb-2 text-sm text-slate-500">
              썸네일 미리보기
            </p>

            <img
              src={formData.thumb_img}
              alt="Thumbnail preview"
              className="aspect-video w-48 rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-5 flex justify-end gap-2">

        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >
            <X size={16} />
            취소
          </button>
        )}

        <button
          type="submit"
          disabled={saving}
          className="
            flex w-full items-center justify-center gap-2
            rounded-lg bg-blue-600 px-5 py-2.5
            text-sm font-medium text-white
            hover:bg-blue-700 disabled:opacity-50
            sm:w-auto
          "
        >
          {editingId ? <Save size={16} /> : <Plus size={16} />}

          {saving
            ? '저장 중...'
            : editingId
              ? '수정 저장'
              : '동영상 등록'}
        </button>
      </div>
    </form>
  );
}