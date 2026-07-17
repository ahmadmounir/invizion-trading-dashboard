import { useI18n } from "@/shared/hooks/useI18n";


export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Copyright */}
          <p className="text-muted-foreground text-center">
            © {currentYear} {t("appName")}.{" "}
            {t("common:footer.allRightsReserved")}
          </p>
      </div>
    </footer>
  );
}
