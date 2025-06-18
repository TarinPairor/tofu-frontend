import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Trophy, Medal } from "lucide-react"
import { useEffect, useState } from "react"
import { userApi } from "@/lib/supabase"
import type { TofuUser } from "@/lib/supabase"

export function Leaderboard() {
  const [users, setUsers] = useState<(TofuUser & { score: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await userApi.getAllUsers()
        // Add random scores between 5 and 10
        const usersWithScores = allUsers.map(user => ({
          ...user,
          score: Number((Math.random() * 5 + 5).toFixed(1))
        }))
        // Sort by score descending
        const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score)
        setUsers(sortedUsers)
      } catch (err) {
        setError('Failed to fetch users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Sustainability Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                      {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-right">{user.score}/10</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}