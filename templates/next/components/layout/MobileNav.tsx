import { Button } from "@/components/ui/button";
import { List } from "@phosphor-icons/react";

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

export const MobileNav = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileNavProps) => {
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background z-50 flex items-center px-4 border-b border-border">
        <Button variant="ghost" size="iconLg" active onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <List size={26} weight="bold" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-muted/20 dark:bg-background/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
