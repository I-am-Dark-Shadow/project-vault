import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    (<Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1c23] px-4 py-3 text-foreground shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
          description: "group-[.toast]:text-white/60 text-xs",
          title: "text-sm font-medium text-white/90",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:ml-3 h-8 w-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20",
        },
      }}
      {...props} />)
  );
}

export { Toaster }