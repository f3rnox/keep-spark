'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState, type ChangeEvent, type JSX } from 'react'
import { clearAppData } from '../../lib/clearAppData'
import { detectBackupFormatFromRaw } from '../../lib/detectBackupFormat'
import { downloadTextFile } from '../../lib/downloadTextFile'
import { exportAppData } from '../../lib/exportAppData'
import { exportEncryptedAppData } from '../../lib/exportEncryptedAppData'
import { importAppData, importEncryptedAppData } from '../../lib/importAppData'
import { importGoogleKeep } from '../../lib/importGoogleKeep'
import { TRASH_RETENTION_DAYS } from '../../lib/purgeExpiredTrash'
import { useLists } from '../../lib/useLists'
import { useNotes } from '../../lib/useNotes'
import { Icon } from '../Icon'
import { PasswordPromptModal } from '../PasswordPromptModal'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * Data management settings for export, import, and reset.
 */
export function DataSettingsPanel(): JSX.Element {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const keepInputRef = useRef<HTMLInputElement | null>(null)
  const { notes } = useNotes()
  const { lists } = useLists()
  const [busy, setBusy] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exportPromptOpen, setExportPromptOpen] = useState<boolean>(false)
  const [importPromptOpen, setImportPromptOpen] = useState<boolean>(false)
  const [pendingImportRaw, setPendingImportRaw] = useState<string | null>(null)
  const [promptError, setPromptError] = useState<string | null>(null)

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

  const handleEncryptedExport = useCallback(async (password: string): Promise<void> => {
    setBusy(true)
    setPromptError(null)
    try {
      const json: string = await exportEncryptedAppData(password)
      const stamp: string = new Date().toISOString().slice(0, 10)
      downloadTextFile(`keepspark-backup-encrypted-${stamp}.json`, json)
      setExportPromptOpen(false)
      setMessage('Encrypted backup downloaded.')
    } catch (exportError: unknown) {
      setPromptError(exportError instanceof Error ? exportError.message : 'Encrypted export failed.')
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
    setPromptError(null)

    try {
      const raw: string = await file.text()
      const format = detectBackupFormatFromRaw(raw)

      if (format === 'keepspark-v2-encrypted') {
        setPendingImportRaw(raw)
        setImportPromptOpen(true)
        return
      }

      if (format === 'google-keep-json') {
        const result = await importGoogleKeep([file])
        setMessage(
          `Imported ${result.noteCount} Google Keep notes${result.listCount > 0 ? ` and ${result.listCount} lists` : ''}.`,
        )
        return
      }

      const result = await importAppData(raw)
      setMessage(`Imported ${result.noteCount} notes and ${result.listCount} lists.`)
    } catch (importError: unknown) {
      setError(importError instanceof Error ? importError.message : 'Import failed.')
    } finally {
      setBusy(false)
    }
  }, [])

  const handleEncryptedImport = useCallback(async (password: string): Promise<void> => {
    if (pendingImportRaw === null) return

    setBusy(true)
    setPromptError(null)
    try {
      const result = await importEncryptedAppData(pendingImportRaw, password)
      setImportPromptOpen(false)
      setPendingImportRaw(null)
      setMessage(`Imported ${result.noteCount} notes and ${result.listCount} lists from encrypted backup.`)
    } catch (importError: unknown) {
      setPromptError(importError instanceof Error ? importError.message : 'Import failed.')
    } finally {
      setBusy(false)
    }
  }, [pendingImportRaw])

  const handleGoogleKeepImport = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files: FileList | undefined = event.target.files ?? undefined
    event.target.value = ''
    if (!files || files.length === 0) return

    setBusy(true)
    setError(null)
    setMessage(null)

    try {
      const result = await importGoogleKeep([...files])
      const skipped: string =
        result.skippedCount > 0 ? ` Skipped ${result.skippedCount} invalid or trashed files.` : ''
      setMessage(
        `Imported ${result.noteCount} Google Keep notes${result.listCount > 0 ? ` and ${result.listCount} lists` : ''}.${skipped}`,
      )
    } catch (importError: unknown) {
      setError(importError instanceof Error ? importError.message : 'Google Keep import failed.')
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
        <SettingsRow label='Export data' description='Download all notes and lists as plain JSON.'>
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
        <SettingsRow
          label='Encrypted export'
          description='Download a password-protected backup blob instead of readable JSON.'
        >
          <button
            type='button'
            disabled={busy}
            onClick={(): void => {
              setPromptError(null)
              setExportPromptOpen(true)
            }}
            className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
          >
            <Icon name='lock' size={16} />
            Export encrypted
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
        <SettingsRow
          label='Import from Google Keep'
          description='Merge Google Takeout JSON or HTML note files. Imported notes are labeled google-keep.'
        >
          <>
            <input
              ref={keepInputRef}
              type='file'
              accept='application/json,.json,text/html,.html'
              multiple
              className='hidden'
              onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                void handleGoogleKeepImport(event)
              }}
            />
            <button
              type='button'
              disabled={busy}
              onClick={(): void => keepInputRef.current?.click()}
              className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
            >
              <Icon name='upload' size={16} />
              Import Keep
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

      {exportPromptOpen ? (
        <PasswordPromptModal
          title='Encrypted export'
          description='Choose a password to protect this backup. You will need it to restore the file.'
          confirmLabel='Export'
          requireConfirm
          error={promptError}
          busy={busy}
          onSubmit={handleEncryptedExport}
          onCancel={(): void => {
            setExportPromptOpen(false)
            setPromptError(null)
          }}
        />
      ) : null}

      {importPromptOpen ? (
        <PasswordPromptModal
          title='Encrypted import'
          description='Enter the password used when this encrypted backup was created.'
          confirmLabel='Import'
          error={promptError}
          busy={busy}
          onSubmit={handleEncryptedImport}
          onCancel={(): void => {
            setImportPromptOpen(false)
            setPendingImportRaw(null)
            setPromptError(null)
          }}
        />
      ) : null}
    </div>
  )
}
