export function PreviewLoading() {
  return (
    <div className="preview-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="preview-loading-mark" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span className="preview-loading-tile" key={index}>{'···\n···\n···'}</span>
        ))}
      </span>
      {/* <span>Loading preview…</span> */}
    </div>
  )
}
