export default function DashboardLoading() {
  return (
    <div className="page-shell" aria-busy="true" aria-label="Loading page">
      <div className="loading-heading" />
      <div className="loading-copy" />
      <div className="panel loading-panel" />
      <div className="panel loading-panel loading-panel-short" />
    </div>
  );
}
