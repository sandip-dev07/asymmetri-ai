import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherData = {
  location?: string;
  temp?: number | string;
  description?: string;
};

export default function WeatherCard({ data }: { data: unknown }) {
  const weather = (data ?? {}) as WeatherData;

  return (
    <Card className="gap-3 py-4 bg-yellow-100 border-none">
      <CardHeader className="px-4">
        <CardTitle>Weather</CardTitle>
        <CardDescription>{weather.location || "Unknown location"}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 text-sm">
        <p>Temperature: {weather.temp ?? "N/A"} C</p>
        <p className="capitalize">Condition: {weather.description ?? "N/A"}</p>
      </CardContent>
    </Card>
  );
}
