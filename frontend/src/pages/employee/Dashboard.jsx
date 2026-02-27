import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import AttendanceChart from "../../components/charts/AttendanceChart";
import LeaveChart from "../../components/charts/LeaveChart";
import TrendChart from "../../components/charts/TrendChart";
import { Clock, Calendar, FileText, Activity, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    attendance: "0%",
    pendingLeaves: 0,
    payslips: 0,
    attendanceData: [],
    isNewEmployee: false,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get("/users/dashboard");
        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Check if user is new (no attendance data)
  const isNewEmployee =
    dashboardData.attendance === "0%" || dashboardData.attendance === "N/A";

  const stats = [
    {
      title: "Attendance",
      value: isNewEmployee ? "N/A" : dashboardData.attendance,
      icon: Clock,
      accent: "primary",
      iconClass: "bg-primary-soft text-primary",
    },
    {
      title: "Pending Leaves",
      value: dashboardData.pendingLeaves,
      icon: Calendar,
      accent: "warning",
      iconClass: "bg-warning-soft text-warning",
    },
    {
      title: "Payslips",
      value: dashboardData.payslips,
      icon: FileText,
      accent: "success",
      iconClass: "bg-success-soft text-success",
    },
  ];

  // Fallback chart data for new employees
  const chartData =
    dashboardData.attendanceData.length > 0
      ? dashboardData.attendanceData
      : [
          { name: "Mon", present: 0, absent: 0, late: 0 },
          { name: "Tue", present: 0, absent: 0, late: 0 },
          { name: "Wed", present: 0, absent: 0, late: 0 },
          { name: "Thu", present: 0, absent: 0, late: 0 },
          { name: "Fri", present: 0, absent: 0, late: 0 },
        ];

  const trendData = isNewEmployee
    ? [
        { name: "W1", value: 0 },
        { name: "W2", value: 0 },
        { name: "W3", value: 0 },
        { name: "W4", value: 0 },
      ]
    : [
        { name: "W1", value: 90 },
        { name: "W2", value: 95 },
        { name: "W3", value: 85 },
        { name: "W4", value: 98 },
      ];

  const leaveData = [
    { name: "Paid", value: 12 },
    { name: "Sick", value: 5 },
    { name: "Casual", value: 3 },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-text-muted">
        Loading dashboard...
      </div>
    );

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading tracking-tight">
          Your Workspace
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Monitor your personal progress and workforce status.
        </p>
        <div className="h-px bg-divider my-6"></div>
      </div>

      {/* Welcome Message for New Employees */}
      {isNewEmployee && (
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary-soft to-info-soft relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-primary/20 w-16 h-16" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-primary mb-2">
              Welcome to the Team! 🎉
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              You're all set! Your performance and attendance data will start
              appearing as you begin your journey with us. Start by clocking in
              and exploring your workspace.
            </p>
            <div className="mt-4 flex gap-3">
              <Link to="/employee/attendance">
                <Button size="sm" variant="primary">
                  Clock In Now
                </Button>
              </Link>
              <Link to="/employee/profile">
                <Button size="sm" variant="secondary">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name}&background=5b5bd6&color=fff`
                }
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover shadow-none group-hover:shadow-hover transition-all"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full ring-4 ring-white"></div>
            </div>
            <h2 className="text-lg font-bold text-text-heading">
              {user?.name}
            </h2>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider mt-1">
              {user?.designation || "Employee"}
            </p>

            <div className="mt-6 w-full">
              <Link to="/employee/profile" className="block w-full">
                <Button
                  variant="secondary"
                  className="w-full text-xs font-bold bg-transparent"
                >
                  Manage Profile
                </Button>
              </Link>
            </div>
          </Card>

          <Card
            title="Leave Utilization"
            subtitle="Annual allocation vs Consumption"
          >
            <div className="h-[220px] w-full flex items-center justify-center">
              <LeaveChart data={leaveData} />
            </div>
            <div className="mt-4 pt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-surface"></div>
                <span>Allocated: 24</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Used: {isNewEmployee ? 0 : 20}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary-soft/30">
            <div>
              <h2 className="text-lg font-bold text-text-heading">
                Good Morning, {user?.name?.split(" ")[0] || "Team"}
              </h2>
              <p className="text-text-muted text-xs mt-1 font-medium">
                {isNewEmployee
                  ? "Welcome! Start your journey by clocking in today."
                  : "There are no urgent action items for you today."}
              </p>
            </div>
            <Link to="/employee/attendance">
              <Button size="sm">Clock In System</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                title={stat.title}
                icon={stat.icon}
                iconClassName={stat.iconClass}
                className="hover:shadow-hover transition-colors"
              >
                <div className="mt-2">
                  <p className="text-3xl font-bold text-text-heading tracking-tight">
                    {stat.value}
                  </p>
                  {isNewEmployee && stat.title === "Attendance" && (
                    <p className="text-xs text-text-muted mt-1">
                      Data will appear after first clock-in
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Weekly Productivity"
              subtitle={
                isNewEmployee
                  ? "Awaiting first week data"
                  : "Projected work consistency breakdown"
              }
            >
              <div className="h-[280px] w-full flex items-center justify-center relative">
                <AttendanceChart data={chartData} />
                {isNewEmployee && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-muted">
                        No data yet
                      </p>
                      <p className="text-xs text-text-muted/70 mt-1">
                        Start clocking in to see your stats
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card
              title="Growth Metric"
              subtitle={
                isNewEmployee
                  ? "Performance tracking starts soon"
                  : "Performance health index trend"
              }
            >
              <div className="h-[280px] w-full flex items-center justify-center relative">
                <TrendChart
                  variant="line"
                  data={trendData}
                  dataKey="value"
                  name="Engagement"
                />
                {isNewEmployee && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-muted">
                        No data yet
                      </p>
                      <p className="text-xs text-text-muted/70 mt-1">
                        Performance metrics coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card
            title="System Activity Log"
            subtitle="Real-time updates from HR management system"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-background text-text-muted flex items-center justify-center shrink-0">
                  <Activity size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-heading truncate">
                    {isNewEmployee
                      ? "Account Created Successfully"
                      : "Logged In Successfully"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {isNewEmployee
                      ? "Welcome to the team! Your account is ready."
                      : "Authentication verified from Session #4920"}
                  </p>
                  <p className="text-[10px] text-text-muted font-bold uppercase mt-1">
                    Today •{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {!isNewEmployee && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-background text-text-muted flex items-center justify-center shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-heading truncate">
                      November Payslip Released
                    </p>
                    <p className="text-xs text-text-muted">
                      A new document is available in your digital vault.
                    </p>
                    <p className="text-[10px] text-text-muted font-bold uppercase mt-1">
                      2 Days Ago
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EmployeeDashboard;
