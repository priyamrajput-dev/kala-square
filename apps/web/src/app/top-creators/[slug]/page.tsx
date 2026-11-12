export default async function TopCreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Creator: {slug}</h1>
      <p className="text-lg text-neutral-600">Coming in next prompt</p>
    </main>
  );
}
