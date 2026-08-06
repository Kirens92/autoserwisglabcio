import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PHONE_NUMBERS = [
  { display: "530 978 968", tel: "530978968" },
  { display: "669 513 740", tel: "669513740" },
];

interface CallButtonProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Przycisk "Zadzwoń" – po kliknięciu pokazuje okno z wyborem numeru,
 * a wybrany numer uruchamia wybieranie (tel:).
 */
const CallButton = ({ className, children }: CallButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={className}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="border gold-border bg-card sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">
            Zadzwoń do nas
          </DialogTitle>
          <DialogDescription className="font-body">
            Wybierz numer, aby rozpocząć połączenie.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3">
          {PHONE_NUMBERS.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-gold text-primary-foreground font-body font-semibold text-base sm:text-lg tracking-wider hover:brightness-110 transition-all"
            >
              <Phone className="w-5 h-5" strokeWidth={2} />
              {phone.display}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallButton;
