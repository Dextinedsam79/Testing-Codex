import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <span className="text-sm font-bold text-white">T</span>
          </div>
          <span className="font-display text-xl font-bold">TalentBoard AI</span>
        </Link>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
            Your Intelligent Career Operating System
          </h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Track applications, showcase projects, optimize resumes, and
            accelerate your job search with AI-powered insights.
          </p>
        </div>

        <p className="text-sm text-white/50">
          Trusted by 10,000+ job seekers worldwide
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
