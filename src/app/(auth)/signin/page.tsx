"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"



import React from 'react'
import { useRouter } from "next/router"
import { signUpSchema } from "@/Schemas/signUpSchema"

const Page = () => {
  const [username,setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isSubmit,setIsSubmit] = useState(false)
  const useDebounceUsername = useDebounceValue(username, 300)
  const { toast } = useToast()
  const  router = useRouter();


  // zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: "",
      password: "",
    },
  });

  return (
    <div>
      
    </div>
  )
}

export default Page
