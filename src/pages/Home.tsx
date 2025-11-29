import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  Brain,
  Database,
  LineChart,
  TrendingUp,
  Languages,
} from "lucide-react";

const Home = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(newLang);
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              {t("header.title")}
            </h1>
          </div>

          {/* Navigation + Language Toggle */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 font-bold"
            >
              <Languages className="h-4 w-4" />
              {i18n.language === "en" ? "TH" : "EN"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <img
              src="/Trio.png"
              alt="Hero Logo"
              className="mx-auto w-40 h-50 rounded-full object-cover shadow-lg"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            {t("hero.heading_part1")}
            <span className="text-primary"> {t("hero.heading_part2")}</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("hero.subheading")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                <BarChart3 className="mr-2 h-5 w-5" />
                {t("hero.explore_dashboard")}
              </Button>
            </Link>

         
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">1.2K+</p>
              <p className="text-sm text-muted-foreground">
                {t("hero.data_points")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-bold text-accent">4</p>
              <p className="text-sm text-muted-foreground">
                {t("hero.ml_models")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-bold text-chart-3">10+</p>
              <p className="text-sm text-muted-foreground">
                {t("hero.cities")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <LineChart className="h-10 w-10 text-accent mb-2" />
              <CardTitle>{t("feature.time_series_title")}</CardTitle>
              <CardDescription>
                {t("feature.time_series_desc")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-chart-3/50 transition-colors">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-chart-3 mb-2" />
              <CardTitle>{t("feature.market_insight_title")}</CardTitle>
              <CardDescription>
                {t("feature.market_insight_desc")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-chart-5/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-chart-5 mb-2" />
              <CardTitle>{t("feature.city_compare_title")}</CardTitle>
              <CardDescription>
                {t("feature.city_compare_desc")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold">{t("header.title")}</span>
          </div>

          <p className="text-sm text-muted-foreground">{t("footer.text")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
