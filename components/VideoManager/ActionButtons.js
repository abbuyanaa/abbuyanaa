import Icon from '@/components/common/Icons';

const ActionButtons = ({
  item,
  onEdit,
  onDelete,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onEdit(item)}
        aria-label="Edit video"
        className="
          flex items-center justify-center
          rounded-lg bg-indigo-50 p-2
          text-indigo-600 transition
          hover:bg-indigo-100
          disabled:opacity-50
        "
      >
        <Icon name="pencil" size={16} />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(item)}
        aria-label="Delete video"
        className="
          flex items-center justify-center
          rounded-lg bg-red-50 p-2
          text-red-600 transition
          hover:bg-red-100
          disabled:opacity-50
        "
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}

export default ActionButtons;
