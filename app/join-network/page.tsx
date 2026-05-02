import { redirectToDashboardOrLogin } from '@/lib/redirect-by-auth'

export default async function JoinNetworkPage() {
  await redirectToDashboardOrLogin()
}
