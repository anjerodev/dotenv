'use client'

import { useForm, zodResolver } from '@mantine/form'
import { ZodSchema } from 'zod'

import { useServerMutation } from '@/hooks/useServerMutation'
import { ActionIcon } from '@/components/ui/action-icon'
import { Input } from '@/components/ui/input'
import { Icon, Icons } from '@/components/icons'

interface InputFormProps {
  id: string
  initialValue?: any
  validationSquema?: ZodSchema<{ [x: string]: any }>
  icon: Icon
  placeholder?: string
  onSubmit?: (values: { [x: string]: any }) => Promise<any>
  onSucced?: () => void
  onError?: (error: string) => void
}

export function InputForm({
  id,
  initialValue,
  validationSquema,
  icon: IconComponent,
  placeholder,
  onSubmit,
  onSucced,
  onError,
}: InputFormProps) {
  const [mutate, { isPending, error }] = useServerMutation()

  const form = useForm({
    initialValues: {
      [id]: initialValue ?? '',
    },
    validate: validationSquema ? zodResolver(validationSquema) : undefined,
  })

  const handleSubmit = (values: { [x: string]: any }) => {
    if (!onSubmit) return

    mutate({
      mutation: onSubmit(values),
      onError: (error) => {
        if (error.form) {
          form.setErrors(error.form)
        } else {
          onError && onError(error.message)
        }
      },
      onSuccess: () => {
        form.resetDirty(values)
        onSucced && onSucced()
      },
    })
  }

  const handleKeyDown = (key: string) => {
    switch (key) {
      case 'Escape':
        if (initialValue && form.values[id] !== initialValue) {
          form.setFieldValue(id, initialValue)
        }
        break
      default:
        break
    }
  }

  const formError = Object.keys(form.errors).includes(id)

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Input
        placeholder={placeholder}
        disabled={isPending}
        onKeyDown={(event) => handleKeyDown(event.key)}
        leftSection={
          <div className="pl-1">
            <IconComponent />
          </div>
        }
        rightSection={
          <ActionIcon
            type="submit"
            loading={isPending}
            disabled={!form.isDirty(id) || isPending}
          >
            {(() => {
              if (error || formError)
                return <Icons.close size={18} className="text-error" />
              if (form.isValid(id) && !form.isDirty(id))
                return <Icons.doubleCheck size={18} className="text-success" />
              return <Icons.check size={18} />
            })()}
          </ActionIcon>
        }
        {...form.getInputProps(id)}
        error={form.errors[id] || error?.form?.[id]}
      />
    </form>
  )
}
