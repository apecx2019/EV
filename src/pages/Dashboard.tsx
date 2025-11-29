import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface EVSalesData {
  date: string;
  city: string;
  ev_sales: number;
  ev_market_share: number;
  avg_ev_price: number;
  gasoline_price: number;
  public_charging_points: number;
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [data, setData] = useState<EVSalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("arima");
  const [selectedCity, setSelectedCity] = useState("Bangkok");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/ev_sales_data.csv");
      const text = await response.text();
      const rows = text.split("\n").slice(1);

      const parsed = rows
        .filter((row) => row.trim())
        .map((row) => {
          const cols = row.split(",");
          return {
            date: cols[0],
            city: cols[1],
            ev_sales: parseFloat(cols[2]) || 0,
            ev_market_share: parseFloat(cols[3]) || 0,
            avg_ev_price: parseFloat(cols[4]) || 0,
            gasoline_price: parseFloat(cols[6]) || 0,
            public_charging_points: parseInt(cols[8]) || 0,
          };
        });

      setData(parsed);
      setLoading(false);

      const years = Array.from(new Set(parsed.map((d) => new Date(d.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
      setAvailableYears(years);
      if (years.length > 0) setSelectedYear(years[0]);

      toast({
        title: t("dashboard.toast_success_title"),
        description: t("dashboard.toast_success_desc", { count: parsed.length }),
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: t("dashboard.toast_error_title"),
        description: t("dashboard.toast_error_desc"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("dashboard.loading")}</p>
      </div>
    );
  }

  const filteredDataByYear = selectedYear ? data.filter((d) => new Date(d.date).getFullYear().toString() === selectedYear) : data;
  const cityData = filteredDataByYear.filter((d) => d.city === selectedCity);

  const monthlyData = cityData.map((d) => ({
    month: new Date(d.date).toLocaleDateString(i18n.language === "th" ? "th-TH" : "en-US", { month: "short" }),
    sales: d.ev_sales,
  }));

  const monthlyCorrelationData = cityData.map((d) => ({
    month: new Date(d.date).toLocaleDateString(i18n.language === "th" ? "th-TH" : "en-US", { month: "short" }),
    evMarketShare: d.ev_market_share * 100,
    avgEVPrice: d.avg_ev_price,
    gasolinePrice: d.gasoline_price,
    publicChargingPoints: d.public_charging_points,
  }));

  const citySummary = Array.from(new Set(filteredDataByYear.map((d) => d.city)))
    .map((city) => {
      const cityRecords = filteredDataByYear.filter((d) => d.city === city);
      const avgMarketShare = cityRecords.length
        ? ((cityRecords.reduce((sum, d) => sum + d.ev_market_share, 0) / cityRecords.length) * 100).toFixed(2)
        : "0.00";
      return {
        city,
        totalSales: cityRecords.reduce((sum, d) => sum + d.ev_sales, 0),
        avgMarketShare,
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);

  const totalSales = data.reduce((sum, d) => sum + d.ev_sales, 0);
  const avgMarketShare = ((data.reduce((sum, d) => sum + d.ev_market_share, 0) / data.length) * 100).toFixed(2);
  const avgChargingPoints = data.length
    ? (data.reduce((sum, d) => sum + d.public_charging_points, 0) / data.length).toFixed(0)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <a href="./">
       <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>
        </div>
      </a>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.metric_total_sales_title")}</CardDescription>
              <CardTitle className="text-3xl text-primary">{totalSales.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("dashboard.metric_total_sales_desc")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.metric_market_share_title")}</CardDescription>
              <CardTitle className="text-3xl text-accent">{avgMarketShare}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("dashboard.metric_market_share_desc")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.metric_charging_points_title")}</CardDescription>
              <CardTitle className="text-3xl text-chart-3">{avgChargingPoints}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("dashboard.metric_charging_points_desc")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">{t("dashboard.tab_dashboard")}</TabsTrigger>
            <TabsTrigger value="predict">{t("dashboard.tab_predict")}</TabsTrigger>
            <TabsTrigger value="analysis">{t("dashboard.tab_analysis")}</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboard.chart_sales_title")} - {selectedCity} ({selectedYear})
                </CardTitle>
                <CardDescription>{t("dashboard.chart_sales_desc")}</CardDescription>
                <div className="pt-2 flex gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(data.map((d) => d.city))).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_year_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name={`${t("dashboard.chart_legend_sales")} ${selectedYear}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* City Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.chart_comparison_title")} ({selectedYear})</CardTitle>
                <CardDescription>{t("dashboard.chart_comparison_desc")}</CardDescription>

                <div className="pt-2">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_year_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={citySummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value, name) => [Number(value).toLocaleString(), name]}
                    />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="totalSales"
                      stroke="hsl(var(--accent))"
                      name={`${t("dashboard.chart_legend_total_sales")} ${selectedYear}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predict Tab */}
          <TabsContent value="predict" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.predict_config_title")}</CardTitle>
                <CardDescription>{t("dashboard.predict_config_desc")}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("dashboard.predict_label_model")}</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arima">ARIMA</SelectItem>
                        <SelectItem value="lstm">LSTM</SelectItem>
                        <SelectItem value="randomforest">Random Forest</SelectItem>
                        <SelectItem value="xgboost">XGBoost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("dashboard.predict_label_target")}</label>
                    <Select defaultValue="sales">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">{t("dashboard.predict_target_sales")}</SelectItem>
                        <SelectItem value="market_share">{t("dashboard.predict_target_market_share")}</SelectItem>
                        <SelectItem value="best_model">{t("dashboard.predict_target_best_model")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full" size="lg">
                    <TrendingUp className="mr-2 h-5 w-5" /> {t("dashboard.predict_button_train")}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">{t("dashboard.predict_note")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboard.analysis_corr_title")} - {selectedCity} ({selectedYear})
                </CardTitle>
                <CardDescription>{t("dashboard.analysis_corr_desc")}</CardDescription>

                <div className="pt-2 flex gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(data.map((d) => d.city))).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_year_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />

                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="hsl(var(--primary))"
                      tickFormatter={(value) => `${value}%`}
                      label={{ value: t("dashboard.analysis_y_market_share"), angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }}
                    />

                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--accent))"
                      label={{ value: t("dashboard.analysis_y_price_points"), angle: 90, position: "insideRight", fill: "hsl(var(--accent))" }}
                    />

                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value, name) => {
                        const num = Number(value);
                        if (name === t("dashboard.analysis_legend_market_share")) return [`${num.toFixed(2)}%`, name];
                        return [num.toLocaleString(), name];
                      }}
                    />

                    <Legend />

                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="evMarketShare"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name={t("dashboard.analysis_legend_market_share")}
                      dot={false}
                    />

                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgEVPrice"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={1}
                      name={t("dashboard.analysis_legend_avg_price")}
                      dot={false}
                    />

                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="publicChargingPoints"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={1}
                      name={t("dashboard.analysis_legend_charging_points")}
                      dot={false}
                    />

                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="gasolinePrice"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={1}
                      name={t("dashboard.analysis_legend_gas_price")}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.analysis_stats_title")}</CardTitle>
                <CardDescription>{t("dashboard.analysis_stats_desc")}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{t("dashboard.stats_summary_title")}</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• {t("dashboard.stats_total_records")}: {data.length.toLocaleString()}</li>
                      <li>• {t("dashboard.stats_cities_covered")}: {new Set(data.map((d) => d.city)).size}</li>
                      <li>• {t("dashboard.stats_time_range")}: {availableYears.at(-1)} - {availableYears[0]}</li>
                      <li>• {t("dashboard.stats_features")}: 7</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
