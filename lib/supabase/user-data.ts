import type { SupabaseClient } from '@supabase/supabase-js'

export type CoverageStatus = 'not_covered' | 'pending' | 'active'
export type AlertThreshold = 'any' | 'major' | 'critical'

export type UserProfileRow = {
  user_id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  address_line1: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  coverage_status: CoverageStatus
}

export type AlertSettingsRow = {
  user_id: string
  alert_radius_miles: number
  threshold: AlertThreshold
  email_alerts: boolean
  sms_alerts: boolean
  push_alerts: boolean
}

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfileRow | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, first_name, last_name, phone, address_line1, city, state, zip_code, coverage_status')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertUserProfile(
  supabase: SupabaseClient,
  row: Partial<UserProfileRow> & { user_id: string },
) {
  const { error } = await supabase.from('user_profiles').upsert(row, { onConflict: 'user_id' })
  if (error) throw error
}

export async function getAlertSettings(
  supabase: SupabaseClient,
  userId: string,
): Promise<AlertSettingsRow | null> {
  const { data, error } = await supabase
    .from('user_alert_settings')
    .select('user_id, alert_radius_miles, threshold, email_alerts, sms_alerts, push_alerts')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertAlertSettings(
  supabase: SupabaseClient,
  row: Partial<AlertSettingsRow> & { user_id: string },
) {
  const { error } = await supabase.from('user_alert_settings').upsert(row, { onConflict: 'user_id' })
  if (error) throw error
}
