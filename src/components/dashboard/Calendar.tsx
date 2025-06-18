import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Calendar as CalendarIcon, Star, Trophy, Leaf } from "lucide-react"

const weeklyScores = [
  { week: "May 1-7", score: 7.5, sticker: "🌟" },
  { week: "May 8-14", score: 8.2, sticker: "🏆" },
  { week: "May 15-21", score: 6.8, sticker: "🌱" },
  { week: "May 22-28", score: 9.0, sticker: "🌟" },
]

export function Calendar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Weekly Sustainability Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyScores.map((week) => (
            <div
              key={week.week}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{week.sticker}</span>
                <div>
                  <h3 className="font-medium">{week.week}</h3>
                  <p className="text-sm text-muted-foreground">
                    Score: {week.score}/10
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {week.score >= 8 && <Trophy className="h-5 w-5 text-yellow-500" />}
                {week.score >= 7 && <Star className="h-5 w-5 text-blue-500" />}
                {week.score >= 6 && <Leaf className="h-5 w-5 text-green-500" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 