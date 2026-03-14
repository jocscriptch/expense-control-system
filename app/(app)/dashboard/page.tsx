export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white mb-3">
          ¡Bienvenido!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Has iniciado sesión correctamente. El dashboard está en construcción.
        </p>
      </div>
    </div>
  );
}
