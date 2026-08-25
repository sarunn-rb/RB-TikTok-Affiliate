"use client";

import { CircleAlert, RotateCcw } from "lucide-react";

export default function DashboardError({ reset }) {
  return (
    <div className="page-shell">
      <section className="panel panel-pad empty-state">
        <CircleAlert size={30} />
        <h1>Something went wrong</h1>
        <p>The page could not be rendered. Try once more; reconnect the shop if the session has expired.</p>
        <button className="btn btn-primary" onClick={reset}><RotateCcw size={16} />Try again</button>
      </section>
    </div>
  );
}
