'use client'

import * as React from 'react'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command'

interface SearchableSelectProps {
  disabled: boolean
  placeholder: string
  options: { [x: string]: any }[]
  onItemSelected: (value: any) => void
  loading?: boolean
  loadingComponent?: React.ReactNode
  heading?: string
  itemComponent?: (value: any) => React.ReactNode
  onChange?: (value: string) => void
  valueKey?: string
  labelKey?: string
}

export const SearchableSelect = ({
  disabled,
  placeholder,
  options,
  onItemSelected,
  loading = false,
  loadingComponent,
  heading,
  itemComponent,
  onChange,
  valueKey = 'value',
  labelKey = 'label',
}: SearchableSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = React.useState(false)

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      if (!isOpen) {
        setOpen(true)
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen]
  )

  const handleBlur = () => {
    setOpen(false)
  }

  const handleFocus = () => {
    setOpen(true)
  }

  const handleSelect = (value: any) => {
    onItemSelected && onItemSelected(value)
  }

  const handleChange: React.FormEventHandler<HTMLDivElement> = (event) => {
    const { value } = event.target as HTMLInputElement
    onChange && onChange(value)
  }

  return (
    <Command
      onValueChange={(value) => console.log({ value })}
      onChange={handleChange}
      shouldFilter={false}
      onKeyDown={handleKeyDown}
    >
      <CommandInput
        ref={inputRef}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isOpen && (loading || (options && options.length > 0)) && (
        <div className="absolute inset-x-0 top-12 z-10 w-full rounded-md border border-foreground/10 bg-popover p-1 text-foreground animate-in fade-in slide-in-from-top-1">
          <CommandList>
            {loading ? (
              <CommandLoading>
                {loadingComponent ? loadingComponent : 'Loading...'}
              </CommandLoading>
            ) : (
              <CommandGroup heading={heading}>
                {options.map((option) => (
                  <CommandItem
                    key={option[valueKey]}
                    value={option[valueKey]}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onSelect={() => handleSelect(option)}
                  >
                    {itemComponent ? itemComponent(option) : option[labelKey]}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      )}
    </Command>
  )
}
