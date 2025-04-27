import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  namespace Electron {
    interface App {
      isQuitting?: boolean
    }
  }

  interface Window {
    electron: ElectronAPI & ApiT
  }

  type ApiT = {
    getCommands: () => Promise<CommandT[]>
    runCommand: (pluginName: string, commandName: string, params) => Promise<ResultT[]>
    getPluginActions: (pluginName: string, commandName: string) => Promise<ActionT[]>
    runPluginAction: (
      pluginName: string,
      commandName: string,
      actionName: string,
      result
    ) => Promise<void>
    listInstalledApplications: () => Promise<ApplicationT[]>
    openApplication: (command: string) => Promise<void>
    openExternal: (url: string) => Promise<void>
    choosePluginsDir: () => Promise<string>
    getPluginsDir: () => Promise<string>
    getHotkeys: () => Promise<{ [key: string]: string }>
    setHotkey: (type: string, hotkey: string) => Promise<void>
    showMainWindow: () => Promise<void>
    hideMainWindow: () => Promise<void>
    reloadApp: () => Promise<void>
  }

  type ApplicationT = {
    command: string
    isImmediate: boolean
    name: string
  }

  type CommandT = {
    bgColor: string
    color: string
    icon: string
    isImmediate: boolean
    keywords: string[]
    label: string
    name: string
    plugin: {
      author: string
      label: string
      name: string
      version: string
    }
  }

  type ShortcutT = {
    bgColor: string
    color: string
    getUrl: (query: string) => string
    icon: string
    label: (query: string) => JSX.Element
    name: string
    bang?: string
  }

  type ResultT = {
    content: ResultContentT[]
    data: Record<string, string>
  }

  type ActionT = {
    action: (param?: string) => void
    name: string
  }

  type ManifestT = {
    author: string
    commands: {
      name: string
      label: string
      isImmediate: boolean
      color: string
      icon: string
      keywords: string[]
    }[]
    label: string
    name: string
    version: string
  }
}

type ResultContentT = {
  children?: ResultContentT[]
  className: string
  content: string
  type: string
}
