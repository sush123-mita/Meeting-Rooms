export default function Navbar({ title, description }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">MEETSPACE WORKSPACE</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>

      <div className="topbar-date">
        {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </header>
  );
}