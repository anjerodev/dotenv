import { getAuthUser } from '@/lib/supabase-server'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AvatarInput } from '@/components/forms/avatar-input'
import { UserForm } from '@/components/forms/user-form'
import { Icons } from '@/components/icons'

export default async function AccountPage() {
  const user = await getAuthUser()

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-8 py-12">
        <div className="title pb-16">Your Account</div>
        <div className="mx-auto flex max-w-sm flex-col items-center">
          {!user?.username && (
            <Alert className="mb-6" variant="warning">
              <Icons.hold size={16} />
              <AlertTitle>Hold on a sec!</AlertTitle>
              <AlertDescription>
                {
                  "We can't let you in without an username. And if you add an avatar, you'll be an unstoppable force."
                }
              </AlertDescription>
            </Alert>
          )}
          <AvatarInput user={user!} />
          <div className="mb-8 mt-10 w-full text-center font-semibold">
            {user?.email}
          </div>
          <div className="grid max-w-[290px] grid-cols-1 gap-6">
            <UserForm user={user!} />
          </div>
        </div>
      </div>
    </>
  )
}
