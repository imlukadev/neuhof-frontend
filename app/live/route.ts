import { redirect } from 'next/navigation'

export async function GET() {
redirect(`https://neuhof-backend.onrender.com`)
}

export async function HEAD() {
  redirect(`https://neuhof-backend.onrender.com`)
}
