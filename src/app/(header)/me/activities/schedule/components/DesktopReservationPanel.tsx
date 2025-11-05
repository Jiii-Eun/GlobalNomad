interface DesktopReservationPanelProps {
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  panelTop: number;
  children: React.ReactNode;
}

export function DesktopReservationPanel({
  onClose,
  panelRef,
  panelTop,
  children,
}: DesktopReservationPanelProps) {
  return (
    <>
      <div className="absolute inset-0 z-40" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`tablet:left-1/2 tablet:right-auto tablet:-translate-x-1/2 tablet:translate-y-0 mobile:max-w-[375px] absolute right-0 z-50 flex h-[700px] w-[420px] flex-col gap-4 overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-7 shadow-lg`}
        style={{ top: Math.max(0, panelTop) }}
      >
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </>
  );
}
