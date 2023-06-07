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
  const handleSelect = (value: any) => {
    onItemSelected && onItemSelected(value)
  }

  const handleChange: React.FormEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLInputElement
    onChange && onChange(target.value)
  }

  return (
    <Command onChange={handleChange} shouldFilter={false}>
      <CommandInput disabled={disabled} placeholder={placeholder} />
      {(loading || (options && options.length > 0)) && (
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
                  onSelect={() => handleSelect(option)}
                >
                  {itemComponent ? itemComponent(option) : option[labelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  )
}
