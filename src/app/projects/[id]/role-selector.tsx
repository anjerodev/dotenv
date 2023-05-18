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
  onChange?: () => void
}

export const roleSelectorOptions = [
  {
    value: 'editor',
    label: 'Can edit',
  },
  {
    value: 'viewer',
    label: 'Can view',
  },
]

export const extraRoleOptions = [
  {
    value: 'owner',
    label: 'Pass ownership',
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
    <SelectTrigger className="max-w-[180px]">
      <SelectValue placeholder="User role" />
    </SelectTrigger>
    <SelectContent>
      {options.map(({ value, label }) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)
