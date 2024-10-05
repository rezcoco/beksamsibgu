"use server"

import { Knock } from "@knocklabs/node"

import { revalidatePath, revalidateTag } from "next/cache"
import { axiosRequest } from "./queries"
import { auth } from "@clerk/nextjs/server"

export async function revalidate(path: string) {
  revalidatePath(path)
}

export async function revalidateByTag(tag: string) {
  revalidateTag(tag)
}

export async function sendNotification(workflowKey: string, actor: string, recipients?: string[]) {
  const knockClient = new Knock(process.env.KNOCK_API_KEY)
  const clerk = auth()

  if (!recipients) {
    try {
      const res = await axiosRequest.get("/users/mainteners", {
        headers: {
          Authorization: `Bearer ${clerk.sessionId}`
        }
      })

      const ids: { id: string }[] = res.data.data
      recipients = ids.map((v) => v.id)
    } catch (error) {
      console.error(error)
    }
  }

  return knockClient.workflows.trigger(workflowKey, {
    actor,
    recipients
  })
}