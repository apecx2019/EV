// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Activity, TrendingUp } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useTranslation } from "react-i18next";

// interface EVSalesData {
//   date: string;
//   city: string;
//   ev_sales: number;
//   ev_market_share: number;
//   avg_ev_price: number;
//   gasoline_price: number;
//   public_charging_points: number;
// }

// const Dashboard = () => {
//   const { t, i18n } = useTranslation();
//   const { toast } = useToast();

//   const [data, setData] = useState<EVSalesData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCity, setSelectedCity] = useState("Bangkok");
//   const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
//   const [predictionResult, setPredictionResult] = useState<any>(null);
//   const [predicting, setPredicting] = useState(false);

//   const cities = [
//     "Bangkok",
//     "Chiang Mai",
//     "Hat Yai",
//     "Khon Kaen",
//     "Nakhon Ratchasima",
//     "Pattaya",
//     "Phuket",
//     "Surat Thani",
//     "Ubon Ratchathani",
//     "Udon Thani"
//   ];

//   const months = [
//     { name: "Jan", value: "1" },
//     { name: "Feb", value: "2" },
//     { name: "Mar", value: "3" },
//     { name: "Apr", value: "4" },
//     { name: "May", value: "5" },
//     { name: "Jun", value: "6" },
//     { name: "Jul", value: "7" },
//     { name: "Aug", value: "8" },
//     { name: "Sep", value: "9" },
//     { name: "Oct", value: "10" },
//     { name: "Nov", value: "11" },
//     { name: "Dec", value: "12" },
//   ];

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/data/ev_sales_data.csv");
//       const text = await response.text();
//       const rows = text.split("\n").slice(1);

//       const parsed = rows
//         .filter((row) => row.trim())
//         .map((row) => {
//           const cols = row.split(",");
//           return {
//             date: cols[0],
//             city: cols[1],
//             ev_sales: parseFloat(cols[2]) || 0,
//             ev_market_share: parseFloat(cols[3]) || 0,
//             avg_ev_price: parseFloat(cols[4]) || 0,
//             gasoline_price: parseFloat(cols[6]) || 0,
//             public_charging_points: parseInt(cols[8]) || 0,
//           };
//         });

//       setData(parsed);
//       setLoading(false);

//       toast({
//         title: t("dashboard.toast_success_title"),
//         description: t("dashboard.toast_success_desc", { count: parsed.length }),
//       });
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       toast({
//         title: t("dashboard.toast_error_title"),
//         description: t("dashboard.toast_error_desc"),
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>{t("dashboard.loading")}</p>
//       </div>
//     );
//   }

//   const filteredDataByMonth = selectedMonth
//     ? data.filter((d) => new Date(d.date).getMonth() + 1 === Number(selectedMonth))
//     : data;
//   const cityData = filteredDataByMonth.filter((d) => d.city === selectedCity);

//   const monthlyData = cityData.map((d) => ({
//     month: new Date(d.date).toLocaleDateString(i18n.language === "th" ? "th-TH" : "en-US", { month: "short" }),
//     sales: d.ev_sales,
//   }));

//   const monthlyCorrelationData = cityData.map((d) => ({
//     month: new Date(d.date).toLocaleDateString(i18n.language === "th" ? "th-TH" : "en-US", { month: "short" }),
//     evMarketShare: d.ev_market_share * 100,
//     avgEVPrice: d.avg_ev_price,
//     gasolinePrice: d.gasoline_price,
//     publicChargingPoints: d.public_charging_points,
//   }));

//   const citySummary = Array.from(new Set(filteredDataByMonth.map((d) => d.city)))
//     .map((city) => {
//       const cityRecords = filteredDataByMonth.filter((d) => d.city === city);
//       const avgMarketShare = cityRecords.length
//         ? ((cityRecords.reduce((sum, d) => sum + d.ev_market_share, 0) / cityRecords.length) * 100).toFixed(2)
//         : "0.00";
//       return {
//         city,
//         totalSales: cityRecords.reduce((sum, d) => sum + d.ev_sales, 0),
//         avgMarketShare,
//       };
//     })
//     .sort((a, b) => b.totalSales - a.totalSales)
//     .slice(0, 10);

//   const totalSales = data.reduce((sum, d) => sum + d.ev_sales, 0);
//   const avgMarketShare = ((data.reduce((sum, d) => sum + d.ev_market_share, 0) / data.length) * 100).toFixed(2);
//   const avgChargingPoints = data.length
//     ? (data.reduce((sum, d) => sum + d.public_charging_points, 0) / data.length).toFixed(0)
//     : "0";

//   const handlePredict = async () => {
//     setPredicting(true);
//     try {
//       const response = await fetch("http://localhost:8888/api/ev_router/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           city: selectedCity,
//           month: parseInt(selectedMonth),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.statusText}`);
//       }

//       const result = await response.json();
//       setPredictionResult(result);
//       toast({
//         title: t("dashboard.predict_success_title") || "Prediction Result",
//         description: "ได้รับผลทำนายสำเร็จ",
//       });
//     } catch (error) {
//       console.error(error);
//       setPredictionResult(null);
//       toast({
//         title: t("dashboard.predict_error_title") || "Prediction Error",
//         description: error instanceof Error ? error.message : "An error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setPredicting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
//       <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//         <a href="./">
//           <div className="container mx-auto px-4 py-4 flex items-center gap-3">
//             <Activity className="h-8 w-8 text-primary" />
//             <div>
//               <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
//               <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
//             </div>
//           </div>
//         </a>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardDescription>{t("dashboard.metric_total_sales_title")}</CardDescription>
//               <CardTitle className="text-3xl text-primary">{totalSales.toLocaleString()}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xs text-muted-foreground">{t("dashboard.metric_total_sales_desc")}</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <CardDescription>{t("dashboard.metric_market_share_title")}</CardDescription>
//               <CardTitle className="text-3xl text-accent">{avgMarketShare}%</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xs text-muted-foreground">{t("dashboard.metric_market_share_desc")}</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <CardDescription>{t("dashboard.metric_charging_points_title")}</CardDescription>
//               <CardTitle className="text-3xl text-chart-3">{avgChargingPoints}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xs text-muted-foreground">{t("dashboard.metric_charging_points_desc")}</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="dashboard" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="dashboard">{t("dashboard.tab_dashboard")}</TabsTrigger>
//             <TabsTrigger value="predict">{t("dashboard.tab_predict")}</TabsTrigger>
//             <TabsTrigger value="analysis">{t("dashboard.tab_analysis")}</TabsTrigger>
//           </TabsList>

//           {/* Dashboard Tab */}
//           <TabsContent value="dashboard" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {t("dashboard.chart_sales_title")} - {selectedCity} (เดือน {selectedMonth})
//                 </CardTitle>
//                 <CardDescription>{t("dashboard.chart_sales_desc")}</CardDescription>
//                 <div className="pt-2 flex gap-4">
//                   <Select value={selectedCity} onValueChange={setSelectedCity}>
//                     <SelectTrigger className="w-[150px]">
//                       <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {cities.map((city) => (
//                         <SelectItem key={city} value={city}>{city}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                     <SelectTrigger className="w-[150px]">
//                       <SelectValue placeholder="เลือกเดือน" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((m) => (
//                         <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={monthlyData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
//                     <YAxis stroke="hsl(var(--muted-foreground))" />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
//                     />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="hsl(var(--primary))"
//                       strokeWidth={2}
//                       name={`${t("dashboard.chart_legend_sales")} เดือน ${selectedMonth}`}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             {/* City Summary */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>{t("dashboard.chart_comparison_title")} (เดือน {selectedMonth})</CardTitle>
//                 <CardDescription>{t("dashboard.chart_comparison_desc")}</CardDescription>

//                 <div className="pt-2">
//                   <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                     <SelectTrigger className="w-[150px]">
//                       <SelectValue placeholder="เลือกเดือน" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((m) => (
//                         <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={citySummary}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
//                     <YAxis stroke="hsl(var(--muted-foreground))" />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
//                       formatter={(value, name) => [Number(value).toLocaleString(), name]}
//                     />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="totalSales"
//                       stroke="hsl(var(--accent))"
//                       name={`${t("dashboard.chart_legend_total_sales")} เดือน ${selectedMonth}`}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Predict Tab */}
//           <TabsContent value="predict" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>{t("dashboard.predict_config_title")}</CardTitle>
//                 <CardDescription>{t("dashboard.predict_config_desc")}</CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">เมืองที่จะทำนาย</label>
//                     <Select value={selectedCity} onValueChange={setSelectedCity}>
//                       <SelectTrigger>
//                         <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {cities.map((city) => (
//                           <SelectItem key={city} value={city}>{city}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">เดือนที่จะทำนาย</label>
//                     <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="เลือกเดือน" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {months.map((m) => (
//                           <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="pt-4 space-y-3">
//                   <Button className="w-full" size="lg" onClick={handlePredict} disabled={predicting}>
//                     <TrendingUp className="mr-2 h-5 w-5" /> {predicting ? "กำลังทำนาย..." : t("dashboard.predict_button_train")}
//                   </Button>
//                   <p className="text-xs text-center text-muted-foreground">{t("dashboard.predict_note")}</p>
                  
//                   {predictionResult && (
//                     <div className="mt-4 p-4 bg-muted rounded-lg">
//                       <p className="text-sm font-semibold mb-2">ผลทำนาย:</p>
//                       <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(predictionResult, null, 2)}</pre>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Analysis Tab */}
//           <TabsContent value="analysis" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {t("dashboard.analysis_corr_title")} - {selectedCity} (เดือน {selectedMonth})
//                 </CardTitle>
//                 <CardDescription>{t("dashboard.analysis_corr_desc")}</CardDescription>

//                 <div className="pt-2 flex gap-4">
//                   <Select value={selectedCity} onValueChange={setSelectedCity}>
//                     <SelectTrigger className="w-[150px]">
//                       <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {cities.map((city) => (
//                         <SelectItem key={city} value={city}>
//                           {city}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                     <SelectTrigger className="w-[150px]">
//                       <SelectValue placeholder="เลือกเดือน" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((m) => (
//                         <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={monthlyCorrelationData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />

//                     <YAxis
//                       yAxisId="left"
//                       orientation="left"
//                       stroke="hsl(var(--primary))"
//                       tickFormatter={(value) => `${value}%`}
//                       label={{ value: t("dashboard.analysis_y_market_share"), angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }}
//                     />

//                     <YAxis
//                       yAxisId="right"
//                       orientation="right"
//                       stroke="hsl(var(--accent))"
//                       label={{ value: t("dashboard.analysis_y_price_points"), angle: 90, position: "insideRight", fill: "hsl(var(--accent))" }}
//                     />

//                     <Tooltip
//                       contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
//                       formatter={(value, name) => {
//                         const num = Number(value);
//                         if (name === t("dashboard.analysis_legend_market_share")) return [`${num.toFixed(2)}%`, name];
//                         return [num.toLocaleString(), name];
//                       }}
//                     />

//                     <Legend />

//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="evMarketShare"
//                       stroke="hsl(var(--primary))"
//                       strokeWidth={2}
//                       name={t("dashboard.analysis_legend_market_share")}
//                       dot={false}
//                     />

//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="avgEVPrice"
//                       stroke="hsl(var(--chart-2))"
//                       strokeWidth={1}
//                       name={t("dashboard.analysis_legend_avg_price")}
//                       dot={false}
//                     />

//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="gasolinePrice"
//                       stroke="hsl(var(--chart-1))"
//                       strokeWidth={1}
//                       name={t("dashboard.analysis_legend_gasoline_price")}
//                       dot={false}
//                     />

//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="publicChargingPoints"
//                       stroke="hsl(var(--chart-3))"
//                       strokeWidth={1}
//                       name={t("dashboard.analysis_legend_charging_points")}
//                       dot={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;



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
  const [selectedCity, setSelectedCity] = useState("Bangkok");
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  const cities = [
    "Bangkok",
    "Chiang Mai",
    "Hat Yai",
    "Khon Kaen",
    "Nakhon Ratchasima",
    "Pattaya",
    "Phuket",
    "Surat Thani",
    "Ubon Ratchathani",
    "Udon Thani"
  ];

  const months = [
    { name: "Jan", value: "1" },
    { name: "Feb", value: "2" },
    { name: "Mar", value: "3" },
    { name: "Apr", value: "4" },
    { name: "May", value: "5" },
    { name: "Jun", value: "6" },
    { name: "Jul", value: "7" },
    { name: "Aug", value: "8" },
    { name: "Sep", value: "9" },
    { name: "Oct", value: "10" },
    { name: "Nov", value: "11" },
    { name: "Dec", value: "12" },
  ];

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

  const filteredDataByMonth = selectedMonth
    ? data.filter((d) => new Date(d.date).getMonth() + 1 === Number(selectedMonth))
    : data;
  const cityData = filteredDataByMonth.filter((d) => d.city === selectedCity);

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

  const citySummary = Array.from(new Set(filteredDataByMonth.map((d) => d.city)))
    .map((city) => {
      const cityRecords = filteredDataByMonth.filter((d) => d.city === city);
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

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const response = await fetch("http://localhost:8888/api/ev_router/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: selectedCity,
          month: parseInt(selectedMonth),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      setPredictionResult(result);
      toast({
        title: t("dashboard.predict_success_title") || "Prediction Result",
        description: "ได้รับผลทำนายสำเร็จ",
      });
    } catch (error) {
      console.error(error);
      setPredictionResult(null);
      toast({
        title: t("dashboard.predict_error_title") || "Prediction Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setPredicting(false);
    }
  };

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
                  {t("dashboard.chart_sales_title")} - {selectedCity} (เดือน {selectedMonth})
                </CardTitle>
                <CardDescription>{t("dashboard.chart_sales_desc")}</CardDescription>
                <div className="pt-2 flex gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="เลือกเดือน" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
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
                      name={`${t("dashboard.chart_legend_sales")} เดือน ${selectedMonth}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* City Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.chart_comparison_title")} (เดือน {selectedMonth})</CardTitle>
                <CardDescription>{t("dashboard.chart_comparison_desc")}</CardDescription>
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
                      name={`${t("dashboard.chart_legend_total_sales")} เดือน ${selectedMonth}`}
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
                    <label className="text-sm font-medium">เมืองที่จะทำนาย</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">เดือนที่จะทำนาย</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเดือน" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full" size="lg" onClick={handlePredict} disabled={predicting}>
                    <TrendingUp className="mr-2 h-5 w-5" /> {predicting ? "กำลังทำนาย..." : t("dashboard.predict_button_train")}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">{t("dashboard.predict_note")}</p>
                  
                  {predictionResult && (
                    <div className="mt-4 p-4 bg-muted rounded-lg shadow-md">
                      <h3 className="text-sm font-semibold mb-2"> ผลทำนาย</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(predictionResult).map(([key, value]) => (
                          <div key={key} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                            <span className="text-xs font-medium capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="text-sm font-semibold text-primary">
                              {typeof value === "number" ? value.toLocaleString() : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboard.analysis_corr_title")} - {selectedCity} (เดือน {selectedMonth})
                </CardTitle>
                <CardDescription>{t("dashboard.analysis_corr_desc")}</CardDescription>

                <div className="pt-2 flex gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("dashboard.chart_select_city_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="เลือกเดือน" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>
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
                      formatter={(value, name) => [typeof value === "number" ? value.toLocaleString() : value, name]}
                    />
                    <Legend />

                    <Line yAxisId="left" type="monotone" dataKey="evMarketShare" stroke="hsl(var(--primary))" name="EV Market Share (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="avgEVPrice" stroke="hsl(var(--accent))" name="Avg EV Price (THB)" />
                    <Line yAxisId="right" type="monotone" dataKey="gasolinePrice" stroke="hsl(var(--destructive))" name="Gasoline Price (THB)" />
                    <Line yAxisId="right" type="monotone" dataKey="publicChargingPoints" stroke="hsl(var(--muted))" name="Public Charging Points" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
