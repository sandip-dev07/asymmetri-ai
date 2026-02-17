export async function getWeather(location: string) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        location
      }&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    );

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      location: data.name,
      temp: data.main?.temp,
      description: data.weather?.[0]?.description,
    };
  } catch (error) {
    console.error("getWeather error:", error);
    throw new Error("Failed to fetch weather data");
  }
}

export async function getStockPrice(symbol: string) {
  try {
    if (!process.env.ALPHAVANTAGE_API_KEY) {
      throw new Error("AlphaVantage API key not configured");
    }

    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`,
    );

    if (!res.ok) {
      throw new Error(`Stock API error: ${res.status}`);
    }

    const data = await res.json();
    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      throw new Error("Invalid stock symbol or API limit reached");
    }

    return {
      symbol: quote["01. symbol"],
      price: quote["05. price"],
    };
  } catch (error) {
    console.error("getStockPrice error:", error);
    throw new Error("Failed to fetch stock price");
  }
}

export async function getF1Matches() {
  try {
    const res = await fetch("https://ergast.com/api/f1/current/next.json");

    if (!res.ok) {
      throw new Error(`F1 api error: ${res.status}`);
    }

    const data = await res.json();
    const race = data?.MRData?.RaceTable?.Races?.[0];

    if (!race) {
      throw new Error("No upcoming race found");
    }

    return {
      raceName: race.raceName,
      date: race.date,
      circuit: race.Circuit?.circuitName,
      location: race.Circuit?.Location?.locality,
    };
  } catch (error) {
    console.error("getF1Matches error:", error);
    throw new Error("Failed to fetch f1 race data");
  }
}
