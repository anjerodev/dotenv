'use client'

import DialogForm from './dialog-form'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type DialogPropsType = {
  projectId: string
  projectName: string
}

export default function DocumentDialog({
  projectId,
  projectName,
}: DialogPropsType) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const documentId = searchParams.get('doc') ?? undefined
  const isNew = searchParams.get('new') === 'true'

  useEffect(() => {
    if (documentId || isNew) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [documentId, isNew])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        closeButton={false}
        className="w-full sm:max-w-3xl"
      >
        <DialogForm
          projectId={projectId}
          projectName={projectName}
          onClose={() => router.push(pathName)}
          {...(!isNew && documentId && { documentId })}
        />
      </DialogContent>
    </Dialog>
  )
}
