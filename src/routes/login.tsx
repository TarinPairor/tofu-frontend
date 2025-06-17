import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { userApi } from '@/lib/supabase'
import { cookies } from '@/lib/cookies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  // Check for existing user cookie
  useEffect(() => {
    const user = cookies.getUser()
    if (user) {
      navigate({ to: '/dashboard' })
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        // Login flow
        const user = await userApi.getUserByUsername(username)
        
        if (!user) {
          setError('User not found')
          return
        }

        if (user.password !== password) {
          setError('Invalid password')
          return
        }

        cookies.setUser({
          id: user.id,
          username: user.username
        })
      } else {
        // Signup flow
        const existingUser = await userApi.getUserByUsername(username)
        if (existingUser) {
          setError('Username already exists')
          return
        }

        const newUser = await userApi.createUser(username, password)
        if (!newUser) {
          setError('Failed to create user')
          return
        }

        cookies.setUser({
          id: newUser.id,
          username: newUser.username
        })
      }

      // Redirect to dashboard after successful login/signup
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError('An error occurred')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? (isLogin ? 'Logging in...' : 'Creating account...')
                : (isLogin ? 'Login' : 'Sign Up')
              }
            </Button>
            <div className="text-center text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}