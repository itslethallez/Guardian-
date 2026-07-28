import { supabase } from './supabase'

export interface CreateInviteResult {
  token: string
  code: string
  url: string
}

export interface AcceptInviteResult {
  inviterName: string
}

async function readFunctionErrorMessage(error: unknown, fallback: string): Promise<string> {
  const context = (error as { context?: Response } | null)?.context
  if (context && typeof context.json === 'function') {
    try {
      const body = await context.json()
      if (typeof body?.error === 'string') {
        return body.error
      }
    } catch {
      // response wasn't JSON — fall through to the default message
    }
  }
  return fallback
}

export async function createInvite(params: {
  contactId: string
  name: string
  phone: string
}): Promise<CreateInviteResult> {
  const { data, error } = await supabase.functions.invoke('create-invite', { body: params })
  if (error) {
    throw new Error(await readFunctionErrorMessage(error, 'Could not create an invite right now.'))
  }
  return data as CreateInviteResult
}

export async function acceptInvite(params: { token?: string; code?: string }): Promise<AcceptInviteResult> {
  const { data, error } = await supabase.functions.invoke('accept-invite', { body: params })
  if (error) {
    throw new Error(await readFunctionErrorMessage(error, 'This invite is no longer valid.'))
  }
  return data as AcceptInviteResult
}
