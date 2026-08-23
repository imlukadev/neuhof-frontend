import { redirect } from 'next/navigation'

export async function GET() {
redirect(`http://localhost:8000/live`)
}

export async function HEAD() {
  redirect(`http://localhost:8000/live`)
}
