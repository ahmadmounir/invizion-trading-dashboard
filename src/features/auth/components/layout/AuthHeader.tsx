import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

interface AuthHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuthHeader({ className, children }: AuthHeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background.",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full px-6 py-4 md:px-10">
        {/* Logo and company name on the left */}
        <Link
          to="/auth/login"
          className="flex items-center gap-3 font-medium hover:opacity-90 transition-opacity"
        >
          <div className="h-full" style={{ width: "50px" }}>
            <img
              className="h-full w-full dark:hidden"
              src="/assets/images/invizion_logo.png"
              alt="Invizion logo"
            />
            <img
              className="hidden h-full w-full dark:block"
              src="/assets/images/invizion_logo.png"
              alt="Invizion logo"
            />
          </div>
        </Link>

        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
