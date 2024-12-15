"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => signIn()}>Sign in</button>
    </>
  )
}