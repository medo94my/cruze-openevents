export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-[#11110f] text-[#f1efe8] flex min-h-[85vh] flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  )
}
