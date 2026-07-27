type HelperCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function HelperCard({
  title,
  description,
  children,
}: HelperCardProps) {
  return (
    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          {description}
        </p>
      </div>

      <div className="bg-zinc-900 p-6">
        {children}
      </div>
    </div>
  );
}