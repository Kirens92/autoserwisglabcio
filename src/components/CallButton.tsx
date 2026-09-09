import { useState } from "react";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export type PhoneEntry = { display: string; tel: string };

export const PHONE_NUMBERS: PhoneEntry[] = [
  { display: "+48 530 978 968", tel: "+48530978968" },
  { display: "+48 669 513 740", tel: "+48669513740" },
];

interface CallButtonProps {
  className?: string;
  children: React.ReactNode;
}

function normalizeTel(value: string) {
  return value.replace(/[^\d+]/g, "");
}

async function loadPanelPhones(): Promise<PhoneEntry[]> {
  try {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    if (!response.ok) throw new Error("site content unavailable");
    const data = await response.json();
    const business = data?.business || {};
    const result: PhoneEntry[] = [];

    if (business.phone) {
      const tel = normalizeTel(String(business.phoneHref || business.phone));
      if (tel) result.push({ display: String(business.phone), tel });
    }
    if (business.phone2) {
      const tel = normalizeTel(String(business.phoneHref2 || business.phone2));
      if (tel && !result.some((entry) => entry.tel === tel)) result.push({ display: String(business.phone2), tel });
    }
    return result.length ? result.slice(0, 2) : PHONE_NUMBERS;
  } catch {
    return PHONE_NUMBERS;
  }
}

const CallButton = ({ className, children }: CallButtonProps) => {
  const [phones, setPhones] = useState<PhoneEntry[]>(PHONE_NUMBERS);

  return (
    <Dialog onOpenChange={(open) => { if (open) void loadPanelPhones().then(setPhones); }}>
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
          {phones.map((phone) => (
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
