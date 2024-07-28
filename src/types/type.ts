import { RankingInfo } from "@tanstack/match-sorter-utils"
import { FilterFn } from "@tanstack/react-table"

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}