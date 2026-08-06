interface ReserveButtonProps {
  className?: string;
  children: React.ReactNode;
}

const ReserveButton = ({ className, children }: ReserveButtonProps) => {
  return (
    <a href="#rezerwacja" className={className}>
      {children}
    </a>
  );
};

export default ReserveButton;
