export default function AuthLayout({ sidePanel, roleToggle, children }) {
  return (
    <div className="min-h-screen w-full bg-purple-300 flex flex-col lg:flex-row gap-4 p-4">
      {sidePanel}

      <div className="flex-1 flex flex-col">
        {/* Wordmark, mobile only (side panel carries it on desktop) */}
        <div className="flex lg:hidden font-sora text-xl font-extrabold text-purple-600 px-2 pt-2">
          Benevolentia
        </div>

        {roleToggle && (
          <div className="flex justify-end px-2 pt-4 lg:px-8 lg:pt-8">
            {roleToggle}
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}