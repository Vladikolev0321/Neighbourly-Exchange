import { SignIn, useUser } from '@clerk/remix'

export default function Home() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-grey-100'>
        <SignIn />
      </div>
      );

  }

}