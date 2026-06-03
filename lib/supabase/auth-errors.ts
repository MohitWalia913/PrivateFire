/** Auth callback errors that are safe to hide — user can sign in with password instead. */
export function isIgnorableAuthRedirectError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes('pkce') ||
    m.includes('code verifier') ||
    m.includes('different browser') ||
    m.includes('storage was cleared')
  )
}
