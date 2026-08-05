interface GenericPageProps {
  title: string;
}

export function GenericPage({ title }: GenericPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-28 px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            {title}
          </h1>
          <p className="mt-4 text-neutral-300">
            This page is under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
