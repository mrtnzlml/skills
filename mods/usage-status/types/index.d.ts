export type Limit = { kind: string; percentUsed: number; resetsAt?: string }

export type Usage = { contextPercent?: number; limits: Limit[] }

export type Header = { model: string; cwd: string; effort?: string; isThinking: boolean }

declare module 'claude-code' {
  interface PluginState {
    'usage-status': { usage: Usage | null; header: Header | null }
  }
}
