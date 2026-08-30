import { redirect } from 'next/navigation'

export async function GET() {
redirect(`https://neuhof-backend.onrender.com/live`)
}

export async function HEAD() {
  redirect(`https://neuhof-backend.onrender.com/live`)
}
