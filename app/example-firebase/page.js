'use client';

import {
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import {
  Video,
  Search,
  LoaderCircle,
} from 'lucide-react';

import useFirebaseCRUD from '@/hooks/useFirebaseCRUD';

import VideoForm from '@/components/VideoForm';
import VideoTable from '@/components/VideoTable';
import VideoList from '@/components/VideoList';

const INITIAL_FORM = {
  title: '',
  video_url: '',
  thumb_img: '',
};

const isValidUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(
      new URL(value).protocol
    );
  } catch {
    return false;
  }
};

export default function VideoManagementPage() {
  const formRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  // Firebase CRUD Hook
  const {
    data: videos,
    loading,
    saving,
    error,
    save,
    remove,
    clearError,
  } = useFirebaseCRUD('videos');

  // 검색
  const filteredVideos = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return videos.filter((item) =>
      (item.title || '').toLowerCase().includes(keyword)
    );
  }, [videos, search]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_FORM });
    setEditingId(null);
    clearError();
  }, [clearError]);

  // 등록 및 수정
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (saving) return;

      const values = {
        title: formData.title.trim(),
        video_url: formData.video_url.trim(),
        thumb_img: formData.thumb_img.trim(),
      };

      if (
        !values.title ||
        !isValidUrl(values.video_url) ||
        !isValidUrl(values.thumb_img)
      ) {
        alert('제목과 올바른 URL을 입력해 주세요.');
        return;
      }

      try {
        await save(values, editingId);

        resetForm();
      } catch (err) {
        console.error(err);
      }
    },
    [formData, editingId, saving, save, resetForm]
  );

  // 수정 버튼
  const handleEdit = useCallback(
    (item) => {
      if (saving) return;

      setEditingId(item.id);

      setFormData({
        title: item.title || '',
        video_url: item.video_url || '',
        thumb_img: item.thumb_img || '',
      });

      clearError();

      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },
    [saving, clearError]
  );

  // 삭제 버튼
  const handleDelete = useCallback(
    async (item) => {
      if (saving) return;

      if (!confirm(`"${item.title}" 삭제하시겠습니까?`)) {
        return;
      }

      try {
        await remove(item.id);

        if (editingId === item.id) {
          resetForm();
        }
      } catch (err) {
        console.error(err);
      }
    },
    [remove, saving, editingId, resetForm]
  );

  const listProps = {
    videos: filteredVideos,
    onEdit: handleEdit,
    onDelete: handleDelete,
    busy: saving,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3 text-white">
            <Video size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              동영상 관리
            </h1>

            <p className="text-sm text-slate-500">
              Video Management
            </p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <section ref={formRef}>
          <VideoForm
            formData={formData}
            setFormData={setFormData}
            editingId={editingId}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </section>

        {/* List Header */}
        <section className="space-y-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-lg font-semibold">
              동영상 목록 ({filteredVideos.length})
            </h2>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목 검색"
                className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 sm:w-72"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-12">
              <LoaderCircle className="animate-spin" />
              데이터 조회 중...
            </div>
          ) : (
            <>
              {/* Desktop */}
              <VideoTable {...listProps} />

              {/* Tablet & Mobile */}
              <VideoList {...listProps} />
            </>
          )}

        </section>
      </div>
    </main>
  );
}