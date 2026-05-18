// Phase 3: Contact CRUD — detail
export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <h1 className="text-2xl font-semibold text-foreground">Contacto {id}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Fase 3 — próximamente</p>
    </main>
  );
}
