'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

import Icon from '@/components/common/Icons';
import useFirebase from '@/hooks/useFirebase';

const INITIAL_FORM = {
  title: '',
  video_url: '',
  thumb_img: '',
};

const FIELDS = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter video title',
    full: true,
  },
  {
    name: 'video_url',
    label: 'Video URL',
    type: 'url',
    placeholder: 'https://example.com/video.mp4',
  },
  {
    name: 'thumb_img',
    label: 'Thumbnail URL',
    type: 'url',
    placeholder: 'https://example.com/image.jpg',
  },
];

const isValidUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(
      new URL(value).protocol
    );
  } catch {
    return false;
  }
};

// ========================================
// Thumbnail
// ========================================

function Thumbnail({ src, title }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="video-thumbnail">
      {src && !failed && isValidUrl(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon name="image-off" size={28} />
      )}
    </div>
  );
}

// ========================================
// Video Link
// ========================================

function VideoLink({ url }) {
  if (!isValidUrl(url)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="video-link"
    >
      <span>{url}</span>
      <Icon name="external-link" size={14} />
    </a>
  );
}

// ========================================
// Action Buttons
// ========================================

function ActionButtons({
  item,
  onEdit,
  onDelete,
  disabled,
}) {
  return (
    <div className="video-actions">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onEdit(item)}
        className="video-button video-button--icon video-button--edit"
        title="Edit"
        aria-label="Edit video"
      >
        <Icon name="pencil" size={16} />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(item)}
        className="
          video-button
          video-button--icon
          video-button--delete
        "
        title="Delete"
        aria-label="Delete video"
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}

// ========================================
// Video Management Page
// ========================================

const VideoManager = () => {
  const formRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const {
    data: videos,
    loading,
    saving,
    error,
    save,
    remove,
    clearError,
    getAll,
  } = useFirebase('video-manager');

  // Search
  const filteredVideos = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return videos.filter((item) =>
      (item.title || '')
        .toLowerCase()
        .includes(keyword)
    );
  }, [videos, search]);

  useEffect(() => {
    getAll();
  }, []); 

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset
  const resetForm = () => {
    setFormData({ ...INITIAL_FORM });
    setEditingId(null);
    clearError();
  };

  // Create & Update
  const handleSubmit = async (e) => {
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
  };

  // Edit
  const handleEdit = (item) => {
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
  };

  // Delete
  const handleDelete = async (item) => {
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
  };

  const actionProps = {
    onEdit: handleEdit,
    onDelete: handleDelete,
    disabled: saving,
  };

  return (
    <main className="video-management">
      <div className="video-management__container">

        {/* HEADER */}
        <header className="video-header">
          <div className="video-header__icon">
            <Icon name="video" size={28} />
          </div>

          <div>
            <h1 className="video-header__title">
              Video Management
            </h1>

            <p className="video-header__description">
              Manage your video content
            </p>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="video-error" role="alert">
            {error}
          </div>
        )}

        {/* FORM */}
        <section
          ref={formRef}
          className="video-form"
        >
          <h2 className="video-form__title">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="video-form__fields">

              {FIELDS.map((field) => (
                <div
                  key={field.name}
                  className={[
                    'video-form__field',
                    field.full
                      ? 'video-form__field--full'
                      : '',
                  ].join(' ')}
                >
                  <label
                    htmlFor={field.name}
                    className="video-form__label"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    disabled={saving}
                    required
                    className="video-form__input"
                  />
                </div>
              ))}

              {/* Thumbnail Preview */}
              {formData.thumb_img && (
                <div className="video-form__preview">
                  <p className="video-form__label">
                    Thumbnail Preview
                  </p>

                  <div className="video-form__preview-image">
                    <Thumbnail
                      key={formData.thumb_img}
                      src={formData.thumb_img}
                      title="Preview"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="video-form__actions">

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="
                    video-button
                    video-button--secondary
                  "
                >
                  <Icon name="x" size={16} />
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="video-button video-button--primary"
              >
                <Icon
                  name={
                    saving
                      ? 'loader'
                      : editingId
                        ? 'save'
                        : 'plus'
                  }
                  size={18}
                  spin={saving}
                />

                {saving
                  ? 'Processing...'
                  : editingId
                    ? 'Save Changes'
                    : 'Add Video'}
              </button>
            </div>
          </form>
        </section>

        {/* CONTENT */}
        <section className="video-content">

          <div className="video-content__header">
            <div className="video-content__heading">

              <h2 className="video-content__title">
                Video List
              </h2>

              <span className="video-content__count">
                {filteredVideos.length}
              </span>
            </div>

            {/* Search */}
            <div className="video-search">
              <Icon
                name="search"
                size={18}
                className="video-search__icon"
              />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search videos..."
                aria-label="Search videos"
                className="video-search__input"
              />
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="video-status">
              <Icon name="loader" size={28} spin />
              <p>Loading...</p>
            </div>
          ) : !filteredVideos.length ? (
            <div className="video-status">
              <Icon name="video" size={40} />
              <p>No videos found</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="video-table">
                <table>
                  <thead>
                    <tr>
                      <th className="video-table__number">
                        No.
                      </th>

                      <th className="video-table__thumbnail">
                        Thumbnail
                      </th>

                      <th>Title</th>

                      <th className="video-table__url">
                        Video URL
                      </th>

                      <th className="video-table__actions">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVideos.map((item, index) => (
                      <tr key={item.id}>

                        <td className="video-table__number">
                          {index + 1}
                        </td>

                        <td>
                          <Thumbnail
                            key={item.thumb_img}
                            src={item.thumb_img}
                            title={item.title}
                          />
                        </td>

                        <td className="video-table__title">
                          {item.title}
                        </td>

                        <td>
                          <VideoLink url={item.video_url} />
                        </td>

                        <td>
                          <ActionButtons
                            item={item}
                            {...actionProps}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TABLET & MOBILE LIST */}
              <div className="video-list">
                {filteredVideos.map((item) => (
                  <article
                    key={item.id}
                    className="video-list__item"
                  >
                    <div className="video-list__thumbnail">
                      <Thumbnail
                        key={item.thumb_img}
                        src={item.thumb_img}
                        title={item.title}
                      />
                    </div>

                    <div className="video-list__content">
                      <h3 className="video-list__title">
                        {item.title}
                      </h3>

                      <VideoLink url={item.video_url} />

                      <div className="video-list__actions">
                        <ActionButtons
                          item={item}
                          {...actionProps}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default VideoManager;
