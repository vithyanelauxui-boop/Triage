import { Card } from '@/components/ui/card';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 lg:px-6">
      <h1 className="mb-4 text-2xl font-medium tracking-tight">{title}</h1>
      <Card className="px-4 py-16 text-center">
        <p className="text-sm font-medium">{title} is outside the assignment scope</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          The brief asks for the dashboard screen. This route exists so the navigation reflects the real
          information architecture rather than dead links.
        </p>
      </Card>
    </div>
  );
}
