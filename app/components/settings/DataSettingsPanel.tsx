'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState, type ChangeEvent, type JSX } from 'react'
import { clearAppData } from '../../lib/clearAppData'
import { downloadTextFile } from '../../lib/downloadTextFile'
import { exportAppData } from '../../lib/exportAppData'
import { importAppData } from '../../lib/importAppData'
import { TRASH_RETENTION_DAYS } from '../../lib/purgeExpiredTrash'
import { useLists } from '../../lib/useLists'
import { useNotes } from '../../lib/useNotes'
import { Icon } from '../Icon'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * Data management settings for export, import, and reset.
 */
export function DataSettingsPanel(): JSX.Element {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { notes } = useNotes()
  const { lists } = useLists()
  const [busy, setBusy] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = useCallback(async (): Promise<void> => {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const json: string = await exportAppData()
      const stamp: string = new Date().toISOString().slice(0, 10)
      downloadTextFile(`keepspark-backup-${stamp}.json`, json)
      setMessage('Backup downloaded.')
    } catch (exportError: unknown) {
      setError(exportError instanceof Error ? exportError.message : 'Export failed.')
    } finally {
      setBusy(false)
    }
  }, [])

  const handleImport = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File | undefined = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      const raw: string = await file.text()
      const result = await importAppData(raw)
      setMessage(`Imported ${result.noteCount} notes and ${result.listCount} lists.`)
    } catch (importError: unknown) {
      setError(importError instanceof Error ? importError.message : 'Import failed.')
    } finally {
      setBusy(false)
    }
  }, [])

  const handleClear = useCallback(async (): Promise<void> => {
    const confirmed: boolean = window.confirm(
      'Delete all notes, lists, and preferences on this device? This cannot be undone.',
    )
    if (!confirmed) return

    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      await clearAppData()
      setMessage('All local data was cleared.')
      router.push('/')
    } catch (clearError: unknown) {
      setError(clearError instanceof Error ? clearError.message : 'Reset failed.')
    } finally {
      setBusy(false)
    }
  }, [router])

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Local storage'
        description='Notes and lists are stored in your browser via IndexedDB. Preferences use localStorage.'
      >
        <SettingsRow label='Notes on this device' description='Active notes across all views.'>
          <span className='text-sm tabular-nums text-muted'>{notes.length}</span>
        </SettingsRow>
        <SettingsRow label='Lists on this device' description='Named lists used to group notes.'>
          <span className='text-sm tabular-nums text-muted'>{lists.length}</span>
        </SettingsRow>
        <SettingsRow
          label='Trash retention'
          description='Trashed notes are permanently deleted after this period.'
        >
          <span className='text-sm text-muted'>{TRASH_RETENTION_DAYS} days</span>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title='Backup'
        description='Export a JSON snapshot or restore from a previous backup file.'
      >
        <SettingsRow label='Export data' description='Download all notes and lists as JSON.'>
          <button
            type='button'
            disabled={busy}
            onClick={(): void => {
              void handleExport()
            }}
            className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
          >
            <Icon name='download' size={16} />
            Export
          </button>
        </SettingsRow>
        <SettingsRow label='Import data' description='Replace current data with a backup file.'>
          <>
            <input
              ref={fileInputRef}
              type='file'
              accept='application/json,.json'
              className='hidden'
              onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                void handleImport(event)
              }}
            />
            <button
              type='button'
              disabled={busy}
              onClick={(): void => fileInputRef.current?.click()}
              className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
            >
              <Icon name='upload' size={16} />
              Import
            </button>
          </>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title='Danger zone'
        description='Permanently remove all notes, lists, and saved preferences from this browser.'
      >
        <SettingsRow label='Reset KeepSpark' description='Cannot be undone. You will return to the home screen.'>
          <button
            type='button'
            disabled={busy}
            onClick={(): void => {
              void handleClear()
            }}
            className='inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500/15 disabled:opacity-50 dark:text-red-400'
          >
            <Icon name='deleteForever' size={16} />
            Clear all data
          </button>
        </SettingsRow>
      </SettingsSection>

      {message ? <p className='text-sm text-foreground'>{message}</p> : null}
      {error ? <p className='text-sm text-red-600 dark:text-red-400'>{error}</p> : null}
    </div>
  )
}
