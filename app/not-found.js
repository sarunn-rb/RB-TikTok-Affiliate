import Link from "next/link";

export default function NotFound() {
  return (
    <main className="standalone-state">
      <div><span>404</span><h1>Page not found</h1><p>The requested Rabbit Bytes Creator Connect page does not exist.</p><Link className="btn btn-primary" href="/">Return to Overview</Link></div>
    </main>
  );
}
