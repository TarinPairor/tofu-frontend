import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Calendar } from "./Calendar"
import { ProgressChart } from "./ProgressChart"
import { Leaderboard } from "./Leaderboard"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="dashboard">Progress</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>
      <TabsContent value="calendar">
        <Calendar />
      </TabsContent>
      <TabsContent value="dashboard">
        <ProgressChart />
      </TabsContent>
      <TabsContent value="leaderboard">
        <Leaderboard />
      </TabsContent>
    </Tabs>
  )
} 