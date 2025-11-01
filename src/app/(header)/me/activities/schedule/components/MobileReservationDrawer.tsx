import { DrawerLayout, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/modal";

interface MobileReservationDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileReservationDrawer({ open, onClose, children }: MobileReservationDrawerProps) {
  if (!open) return null;

  return (
    <DrawerLayout
      trigger={<div />}
      title="예약 정보"
      onClose={onClose}
      isClose={true}
      isOpen={open}
    >
      <DrawerHeader />
      <DrawerBody frameClass="pt-4">{children}</DrawerBody>
      <DrawerFooter buttonText="닫기" onClick={onClose} />
    </DrawerLayout>
  );
}
