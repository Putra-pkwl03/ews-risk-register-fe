import PieChartGrading from "../dashboard/PieChartGrading";
import VerticalBarChartByCluster from "../dashboard/BarChart";
import RiskHandlingEvaluationChart from "../dashboard/RiskHandlingEvaluationChart";
import RiskSummaryBox from "../dashboard/RiskSummaryBox";
import RiskStatusSummaryBox from "../dashboard/RiskStatusSummaryBox"; 
import RiskControlScoringSummary from "../dashboard/RiskControlScoringSummary";

export default function WelcomeDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Ringkasan Risiko - Grid 3 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RiskSummaryBox />
        <RiskStatusSummaryBox />
        <RiskControlScoringSummary />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bar Chart per Cluster */}
        <div className="w-full lg:w-2/3">
          <VerticalBarChartByCluster />
        </div>

        {/* Pie Chart Grading */}
        <div className="w-full lg:w-1/3">
          <PieChartGrading />
        </div>
      </div>

      {/* Grafik Evaluasi Penanganan Risiko */}
      <RiskHandlingEvaluationChart />
    </div>
  );
}
