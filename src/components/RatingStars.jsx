export default function RatingStars({ nota, onSelect }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="stars">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className="star-btn"
          onClick={() => onSelect && onSelect(s)}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
        >
          <span className={s <= nota ? 'star-filled' : 'star-empty'}>★</span>
        </button>
      ))}
    </div>
  );
}
