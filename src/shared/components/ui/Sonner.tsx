import { useTheme } from "@/shared/components/theme/UseTheme";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      // التعديل السحري هون: رفعنا الطبقة لـ 100 وأجبرنا تفعيل النقرات
      className="toaster group z-[100] pointer-events-auto"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg cursor-pointer",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      // تأكيد إضافي للستايل عشان ما ينعمل له Override
      style={{ zIndex: 100 }}
      {...props}
    />
  );
};

export { Toaster };
