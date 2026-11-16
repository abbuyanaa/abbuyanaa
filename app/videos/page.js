'use client';

import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Search,
  Video,
  LoaderCircle,
} from 'lucide-react';

import VideoForm from '../../components/VideoForm';
// import VideoTable from '../../components/VideoTable';
// import VideoList from '../../components/VideoList';

import {
  createVideo,
  subscribeVideos,
  updateVideo,
  deleteVideo,
} from '@/services/exampleVideo';

const initialFormData = {
  title: '',
  video_url: '',
  thumb_img: '',
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function VideoManagementPage() {
  const formRef = useRef(null);

  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // READ
  useEffect(() => {
    const unsubscribe = subscribeVideos(
      (data) => {
        setVideos(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('동영상 목록 조회에 실패했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // SEARCH
  const filteredVideos = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return videos.filter((video) =>
      (video.title || '').toLowerCase().includes(keyword)
    );
  }, [videos, search]);

  // RESET FORM
  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingId(null);
  };

  // CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving || deleting) return;

    const data = {
      title: formData.title.trim(),
      video_url: formData.video_url.trim(),
      thumb_img: formData.thumb_img.trim(),
    };

    if (
      !data.title ||
      !isValidUrl(data.video_url) ||
      !isValidUrl(data.thumb_img)
    ) {
      setError('제목과 올바른 URL을 입력해 주세요.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await updateVideo(editingId, data);
      } else {
        await createVideo(data);
      }

      resetForm();

    } catch (err) {
      console.error(err);
      setError('동영상 저장에 실패했습니다.');

    } finally {
      setSaving(false);
    }
  };

  // EDIT
  const handleEdit = (video) => {
    setEditingId(video.id);

    setFormData({
      title: video.title,
      video_url: video.video_url,
      thumb_img: video.thumb_img,
    });

    setError('');

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // DELETE
  const handleDelete = async (video) => {
    if (saving || deleting) return;

    const confirmed = window.confirm(
      `"${video.title}" 동영상을 삭제하시겠습니까?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError('');

      await deleteVideo(video.id);

      if (editingId === video.id) {
        resetForm();
      }

    } catch (err) {
      console.error(err);
      setError('동영상 삭제에 실패했습니다.');

    } finally {
      setDeleting(false);
    }
  };

  const listProps = {
    videos: filteredVideos,
    onEdit: handleEdit,
    onDelete: handleDelete,
    busy: saving || deleting,
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
            <h1 className="text-xl font-bold sm:text-2xl">
              동영상 관리
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Video Management
            </p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <section ref={formRef} className="scroll-mt-4">

          <VideoForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            editingId={editingId}
            saving={saving || deleting}
          />

        </section>

        {/* List Header */}
        <section className="space-y-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                동영상 목록
              </h2>

              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-600">
                {filteredVideos.length}개
              </span>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">

              <Search
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="동영상 제목 검색"
                className="
                  w-full rounded-lg border border-slate-200
                  bg-white py-2.5 pl-10 pr-3 text-sm
                  outline-none focus:border-blue-500
                "
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border bg-white p-12 text-slate-500">

              <LoaderCircle
                size={20}
                className="animate-spin"
              />

              데이터를 불러오는 중...

            </div>
          ) : (
            <>
              {/* Desktop */}
              {/* <VideoTable {...listProps} /> */}

              {/* Tablet & Mobile */}
              {/* <VideoList {...listProps} /> */}
            </>
          )}

        </section>
      </div>
    </main>
  );
}