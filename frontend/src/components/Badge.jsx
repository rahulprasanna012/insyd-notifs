export default function Badge({ count = 0 }) {
  const has = count > 0;
  return (
    <span className="badge" style={{ background: has ? "#d4380d" : "#555" }} title={`${count} unread`}>
      {count}
    </span>
  );
}
