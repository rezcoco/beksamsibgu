import { RankingInfo } from "@tanstack/match-sorter-utils"
import { FilterFn } from "@tanstack/react-table"

export { }

declare global {
  interface CustomJwtSessionClaims {
    userId: string
    firstName: string
    lastName: string
    username: string
    role: string
  }
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}