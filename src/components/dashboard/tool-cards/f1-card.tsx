import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type F1Data = {
  raceName?: string;
  date?: string;
  circuit?: string;
  location?: string;
};

export default function F1Card({ data }: { data: unknown }) {
  const race = (data ?? {}) as F1Data;

  return (
    <Card className="gap-3 py-4 bg-red-200 border-none  rounded-l-none rounded-b-xl rounded-r-xl">
      <CardHeader className="px-4">
        <CardTitle>Next F1 Race</CardTitle>
        <CardDescription>{race.raceName || "Unknown race"}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 text-sm">
        <p>Date: {race.date ?? "N/A"}</p>
        <p>Circuit: {race.circuit ?? "N/A"}</p>
        <p>Location: {race.location ?? "N/A"}</p>
      </CardContent>
    </Card>
  );
}
