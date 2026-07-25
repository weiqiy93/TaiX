export function Placeholder({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {note ??
          "This screen is out of scope for the prototype. The demo flow lives on the Dashboard and John Smith's return."}
      </p>
    </div>
  );
}
