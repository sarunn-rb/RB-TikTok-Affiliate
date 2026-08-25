import { Rabbit } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true"><Rabbit size={26} strokeWidth={2.2} /></span>
      {!compact && <span className="brand-name">Rabbit Bytes<br />Creator Connect</span>}
    </div>
  );
}
