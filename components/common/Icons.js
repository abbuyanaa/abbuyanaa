const Icon = ({
  name,
  size = 20,
  className = '',
  spin = false,
}) => (
  <span
    aria-hidden="true"
    className={[
      'app-icon',
      `app-icon-${name}`,
      `app-icon-size-${size}`,
      spin && 'app-icon-spin',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
);

export default Icon;
