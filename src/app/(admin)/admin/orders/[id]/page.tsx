export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Деталі замовлення</h1>
      <p className="mt-2 text-muted-foreground">ID: {id}</p>
    </div>
  );
}
