import { openBookingModal } from "@/lib/motowarsztatBooking";

interface ReserveButtonProps {
  className?: string;
  children: React.ReactNode;
}

const ReserveButton = ({ className, children }: ReserveButtonProps) => {
  return (
    <button type="button" className={className} onClick={openBookingModal}>
      {children}
    </button>
  );
};

export default ReserveButton;
