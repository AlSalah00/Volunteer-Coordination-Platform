function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ src, name, size = 96, className = "" }) {
  const style = { width: size, height: size };

  if (src) {
    return <img src={src} alt="" style={style} className={`rounded-full object-cover ${className}`} />;
  }

  return (
    <div
      style={{ ...style, fontSize: size * 0.36 }}
      className={`flex items-center justify-center rounded-full bg-purple-600 font-sora font-extrabold text-purple-50 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
