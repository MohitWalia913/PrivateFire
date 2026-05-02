import { redirectToDashboardOrLogin } from '@/lib/redirect-by-auth'

export default async function AboutPage() {
  await redirectToDashboardOrLogin()
}
