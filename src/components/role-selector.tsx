import { MemberRole } from '@/types/collections'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type RoleSelectorOptionsType = {
  value: string
  label: string
}

type RoleSelectorType = {
  options: RoleSelectorOptionsType[]
  value?: any
  disabled?: boolean
  onChange?: (value: string) => void
}

export const roleSelectorOptions = [
  {
    value: MemberRole.Editor,
    label: 'Can edit',
  },
  {
    value: MemberRole.Viewer,
    label: 'Can view',
  },
  {
    value: 'remove',
    label: 'Remove',
  },
]

export const RoleSelector = ({
  value,
  disabled,
  onChange,
  options,
}: RoleSelectorType) => (
  <Select disabled={disabled} value={value} onValueChange={onChange}>
    <SelectTrigger
      className={cn(value === 'remove' && 'text-destructive', 'max-w-fit')}
    >
      <SelectValue placeholder="User role" />
    </SelectTrigger>
    <SelectContent>
      {options.map(({ value, label }) => (
        <SelectItem
          key={value}
          value={value}
          className={cn(
            value === 'remove' &&
              'text-destructive focus:bg-destructive/10 focus:text-destructive'
          )}
        >
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)
