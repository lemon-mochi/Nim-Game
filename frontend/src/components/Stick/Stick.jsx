export default function Stick({ removing }) {
  return <div className={`stick${removing ? " removing" : ""}`} />;
}
