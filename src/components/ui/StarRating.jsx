export default function StarRating({ rating, max = 5, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, lineHeight: 1 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? '#F4A823' : '#E2E8F0', fontSize: size }}>★</span>
      ))}
    </span>
  )
}
