import { toast } from "sonner";

export { toast };

// هون بنستخدم الميزة المدمجة بالمكتبة بدال ما نولد ID ونمرق onClick وهمي
const defaultOptions = {
  closeButton: true, // هاد بضيف زر X صغير بيسكر التوست لحاله
};

export const showToast = {
  success: (message: string) => toast.success(message, defaultOptions),
  error: (message: string) => toast.error(message, defaultOptions),
  info: (message: string) => toast.info(message, defaultOptions),
  warning: (message: string) => toast.warning(message, defaultOptions),
  default: (message: string) => toast(message, defaultOptions),
};