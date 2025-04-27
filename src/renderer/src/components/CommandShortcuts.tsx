import { CommandGroup, CommandItem } from '@renderer/elements/Command'
import { SHORTCUTS, winElectron } from '@renderer/lib/utils'
import { useMemo } from 'react';

type CommandShortcutsProps = { commandSearch: string }

function getBang(commandSearch: string) {
  if (!commandSearch.startsWith('!'))
    return { isBang: false as const };

  let spaceIndex = commandSearch.indexOf(' ');
  if (spaceIndex == -1)
    spaceIndex = commandSearch.length;

  const bang = commandSearch.substring(1, spaceIndex);
  const search = commandSearch.substring(spaceIndex + 1);

  return {
    isBang: true as const,
    bang,
    search
  }
}

function filterShortcuts(commandSearch: string) {
  const {isBang, bang} = getBang(commandSearch);
  if (!isBang)
    return SHORTCUTS;

  return SHORTCUTS.filter(s => s.bang?.startsWith(bang) ?? false);
}

export const CommandShortcuts = ({ commandSearch }: CommandShortcutsProps) => {
  const { shortcuts, search } = useMemo(() => {
    const elements = filterShortcuts(commandSearch);
    const bangResult = getBang(commandSearch);

    return {
      search: bangResult.search ?? commandSearch,
      shortcuts: elements
    };
  }, [commandSearch]);

  const onSelect = (shortcut: ShortcutT) => {
    if (winElectron && winElectron.openExternal) {
      const url = shortcut.getUrl(search)
      winElectron.openExternal(url)
      winElectron.hideMainWindow()
    }
  }

  return (
    <CommandGroup heading="Shortcuts">
      {shortcuts.map((shortcut) => (
        <CommandItem key={shortcut.name} onSelect={() => onSelect(shortcut)} value={shortcut.name}>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div
                className="flex items-center justify-center h-5 w-5 rounded-sm"
                style={{ backgroundColor: shortcut.bgColor, color: shortcut.color }}
              >
                <i className={`ph ph-${shortcut.icon}`} />
              </div>
              <span>{shortcut.label(search)}</span>
            </div>
            <span className="text-xs text-zinc-300">{shortcut.bang ? `!${shortcut.bang} Shortcut` : 'Shortcut'}</span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
