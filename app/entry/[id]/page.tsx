import { EntryFlow } from "@/components/EntryFlow";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Forge</h1>
        <EntryFlow entryId={id} />
      </main>
    </div>
  );
}
