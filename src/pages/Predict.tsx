// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Activity, TrendingUp } from "lucide-react";

// interface EVSalesData {
//   city: string;
//   ev_sales: number;
//   ev_market_share: number;
//   avg_ev_price: number;
//   gasoline_price: number;
//   public_charging_points: number;
// }

// const DashboardPredict = () => {
//   const { toast } = useToast();

//   const [inputData, setInputData] = useState<EVSalesData[]>([
//     { city: "", ev_sales: 0, ev_market_share: 0, avg_ev_price: 0, gasoline_price: 0, public_charging_points: 0 },
//   ]);

//   const [cities, setCities] = useState<string[]>([]);

//   // โหลด CSV เมื่อ component mount
//   useEffect(() => {
//     const loadCSV = async () => {
//       try {
//         const response = await fetch("/data/ev_sales_data.csv");
//         const text = await response.text();
//         const rows = text.split("\n").slice(1); // skip header
//         const parsed: EVSalesData[] = rows
//           .filter(row => row.trim())
//           .map(row => {
//             const cols = row.split(",");
//             return {
//               city: cols[1],
//               ev_sales: parseFloat(cols[2]) || 0,
//               ev_market_share: parseFloat(cols[3]) || 0,
//               avg_ev_price: parseFloat(cols[4]) || 0,
//               gasoline_price: parseFloat(cols[6]) || 0,
//               public_charging_points: parseInt(cols[8]) || 0,
//             };
//           });
//         const uniqueCities = Array.from(new Set(parsed.map(d => d.city)));
//         setCities(uniqueCities);
//       } catch (err) {
//         console.error(err);
//         toast({
//           title: "Error loading CSV",
//           description: "ไม่สามารถโหลดข้อมูลจาก CSV ได้",
//           variant: "destructive",
//         });
//       }
//     };
//     loadCSV();
//   }, [toast]);

//   const addRow = () => {
//     setInputData([
//       ...inputData,
//       { city: "", ev_sales: 0, ev_market_share: 0, avg_ev_price: 0, gasoline_price: 0, public_charging_points: 0 },
//     ]);
//   };

//   const removeRow = (idx: number) => {
//     setInputData(inputData.filter((_, i) => i !== idx));
//   };

//   const updateRow = <K extends keyof EVSalesData>(idx: number, field: K, value: EVSalesData[K]) => {
//     const newData = [...inputData];
//     newData[idx][field] = value;
//     setInputData(newData);
//   };

//   const handlePredict = () => {
//     console.log("Predict input data:", inputData);
//     toast({
//       title: "Prediction complete",
//       description: "ผลลัพธ์เป็นตัวอย่าง ยังไม่เชื่อม backend",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
//       <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4 flex items-center gap-3">
//           <Activity className="h-8 w-8 text-primary" />
//           <div>
//             <h1 className="text-2xl font-bold">Predict EV Growth</h1>
//             <p className="text-sm text-muted-foreground">เลือก city จาก dropdown และกรอกตัวเลขเพื่อทำ Predict</p>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Input Data</CardTitle>
//             <CardDescription>เลือกค่า city จาก dropdown และกรอกตัวเลขสำหรับ column ที่จำเป็น</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="overflow-x-auto">
//               <table className="w-full border border-muted-foreground">
//                 <thead>
//                   <tr className="bg-muted">
//                     <th className="border px-2 py-1">City</th>
//                     <th className="border px-2 py-1">EV Sales</th>
//                     <th className="border px-2 py-1">EV Market Share</th>
//                     <th className="border px-2 py-1">Avg EV Price</th>
//                     <th className="border px-2 py-1">Gasoline Price</th>
//                     <th className="border px-2 py-1">Charging Points</th>
//                     <th className="border px-2 py-1">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {inputData.map((row, idx) => (
//                     <tr key={idx}>
//                       <td className="border px-2 py-1">
//                         <select
//                           value={row.city}
//                           onChange={(e) => updateRow(idx, "city", e.target.value)}
//                           className="w-full border rounded px-1 py-0.5"
//                         >
//                           <option value="">Select City</option>
//                           {cities.map((c) => (
//                             <option key={c} value={c}>{c}</option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="border px-2 py-1">
//                         <input
//                           type="number"
//                           value={row.ev_sales}
//                           onChange={(e) => updateRow(idx, "ev_sales", Number(e.target.value))}
//                           className="w-full border rounded px-1 py-0.5"
//                         />
//                       </td>
//                       <td className="border px-2 py-1">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={row.ev_market_share}
//                           onChange={(e) => updateRow(idx, "ev_market_share", Number(e.target.value))}
//                           className="w-full border rounded px-1 py-0.5"
//                         />
//                       </td>
//                       <td className="border px-2 py-1">
//                         <input
//                           type="number"
//                           value={row.avg_ev_price}
//                           onChange={(e) => updateRow(idx, "avg_ev_price", Number(e.target.value))}
//                           className="w-full border rounded px-1 py-0.5"
//                         />
//                       </td>
//                       <td className="border px-2 py-1">
//                         <input
//                           type="number"
//                           value={row.gasoline_price}
//                           onChange={(e) => updateRow(idx, "gasoline_price", Number(e.target.value))}
//                           className="w-full border rounded px-1 py-0.5"
//                         />
//                       </td>
//                       <td className="border px-2 py-1">
//                         <input
//                           type="number"
//                           value={row.public_charging_points}
//                           onChange={(e) => updateRow(idx, "public_charging_points", Number(e.target.value))}
//                           className="w-full border rounded px-1 py-0.5"
//                         />
//                       </td>
//                       <td className="border px-2 py-1 text-center">
//                         <Button variant="destructive" size="sm" onClick={() => removeRow(idx)}>Remove</Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex gap-4">
//               <Button onClick={addRow}>Add Row</Button>
//               <Button variant="secondary" onClick={handlePredict}>
//                 <TrendingUp className="mr-2 h-5 w-5" /> Predict
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default DashboardPredict;
