export default function ConfirmModal({ open, title, body, onOk, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
      <div className="w-[420px] rounded-2xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-white/80">{body}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-white/90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
