import { PUBLIC_KNOCK_API_KEY } from "@/constants"
import { Knock } from "@knocklabs/node"

export const publicKnockClient = new Knock(PUBLIC_KNOCK_API_KEY)