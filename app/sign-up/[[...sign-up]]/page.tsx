import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FinOps AI</h1>
          <p className="text-zinc-400">Start your financial journey today</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              card: "bg-zinc-900 border border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-zinc-400",
              socialButtonsBlockButton: "bg-zinc-800 border-white/10 text-white",
              formFieldLabel: "text-zinc-300",
              formFieldInput: "bg-zinc-800 border-white/10 text-white",
              footerActionLink: "text-emerald-400",
              formButtonPrimary: "bg-emerald-500 hover:bg-emerald-600",
            }
          }}
        />
      </div>
    </div>
  );
}