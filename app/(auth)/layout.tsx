import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden relative bg-[#0a1b12] text-white transition-colors duration-200">
      {/* ============ Left Panel: Illustration ============ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-12 overflow-hidden border-r border-gray-100">
        {/* Decorative gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
          {/* Illustration image */}
          <div className="mb-8 w-full aspect-square max-w-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-black/5">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbqzLzEqAIpsgk3jMmR3Ah2TJncffNmGGB38DF7xW4GZH4kdW5lSv7Ok8kbT-PzhLJ2_P1xOpxkdZFdNPyUlGrHSNaiOnaNZaE3Qp5MpjVib5WS1XhWXxIRQ2LtbZnK1hpSWAuO-FcvhKN3oA6dGPjJjctVMGLbF1yGhI89soUbXb4-Au2Jc7Q_9RJgKt4Q15g5Fv7ICtK7pVPp0OtX1cTI6atRyruPwdb6MOy7g6Epy7KinX3uYGoAwx4aiqto3vdagn1ODQQZx8"
              alt="Planta creciendo de un frasco de monedas simbolizando el ahorro"
              width={400}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-text-main mb-3">
            Control total de tus finanzas
          </h3>
          <p className="text-gray-500 text-lg leading-relaxed">
            Gestiona tu presupuesto familiar de manera inteligente y visualiza tu
            crecimiento mes a mes.
          </p>
        </div>
      </div>

      {/* ============ Right Panel: Form ============ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-24 relative bg-[#0a1b12] overflow-y-auto">
        {/* Decorative background gradients (now visible on desktop too) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full flex justify-center py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
