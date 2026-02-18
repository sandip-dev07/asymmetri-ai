import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StockData = {
  symbol?: string;
  price?: string | number;
};

export default function StockCard({ data }: { data: unknown }) {
  const stock = (data ?? {}) as StockData;

  return (
    <Card className="gap-3 py-4 bg-blue-200 border-none  rounded-l-none rounded-b-xl rounded-r-xl">
      <CardHeader className="px-4">
        <CardTitle>Stock Price</CardTitle>
        <CardDescription>{stock.symbol || "Unknown symbol"}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 text-sm">
        <p>Price: {stock.price ?? "N/A"} USD</p>
      </CardContent>
    </Card>
  );
}
