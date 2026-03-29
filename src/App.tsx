import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import DashboardLayout from "@/components/DashboardLayout";
import TalentRadar from "@/pages/TalentRadar";
import SuccessionPlanner from "@/pages/SuccessionPlanner";
import ScenarioSimulator from "@/pages/ScenarioSimulator";
import UpskillingMap from "@/pages/UpskillingMap";
import CompensationPulse from "@/pages/CompensationPulse";
import AIAdvisor from "@/pages/AIAdvisor";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <EmployeeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<TalentRadar />} />
                <Route path="/succession" element={<SuccessionPlanner />} />
                <Route path="/simulator" element={<ScenarioSimulator />} />
                <Route path="/upskilling" element={<UpskillingMap />} />
                <Route path="/compensation" element={<CompensationPulse />} />
                <Route path="/advisor" element={<AIAdvisor />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </BrowserRouter>
        </EmployeeProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
