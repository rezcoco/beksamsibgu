// "use client";

// import * as React from "react";
// import {
//   CaretSortIcon,
//   ChevronDownIcon,
//   DotsHorizontalIcon,
// } from "@radix-ui/react-icons";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   FilterFn,
//   SortingFn,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   sortingFns,
// } from "@tanstack/react-table";
// import { rankItem, compareItems } from "@tanstack/match-sorter-utils";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useMediaQuery from "@/hooks/use-media-query";

// const vocabularyData: Vocabulary[] = [
//   {
//     id: "vocab1",
//     hangeul: "안녕하세요",
//     translation: "Halo",
//     chapter: 5,
//     reference: "Korean Basic Greetings",
//   },
//   {
//     id: "vocab2",
//     hangeul: "감사합니다",
//     translation: "Terima kasih",
//     chapter: 2,
//     reference: "Common Korean Phrases",
//   },
//   {
//     id: "vocab3",
//     hangeul: "사랑해요",
//     translation: "Aku cinta kamu",
//     chapter: 14,
//     reference: "Romantic Korean Expressions",
//   },
//   {
//     id: "vocab4",
//     hangeul: "학교",
//     translation: "Sekolah",
//     chapter: 8,
//     reference: "Korean Vocabulary for Students",
//   },
//   {
//     id: "vocab5",
//     hangeul: "음식",
//     translation: "Makanan",
//     chapter: 20,
//     reference: "Korean Food Vocabulary",
//   },
//   {
//     id: "vocab6",
//     hangeul: "친구",
//     translation: "Teman",
//     chapter: 11,
//     reference: "Korean Vocabulary for Relationships",
//   },
//   {
//     id: "vocab7",
//     hangeul: "날씨",
//     translation: "Cuaca",
//     chapter: 25,
//     reference: "Korean Weather Terms",
//   },
//   {
//     id: "vocab8",
//     hangeul: "책",
//     translation: "Buku",
//     chapter: 17,
//     reference: "Korean Vocabulary for Everyday Items",
//   },
// ];

// export type Vocabulary = {
//   id: string;
//   hangeul: string;
//   translation: string;
//   chapter: number;
//   reference: string;
// };

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const hangeul = getValidSyllable(value);
//   const v = isValidSyllable(value) ? hangeul : value;
//   const itemRank = rankItem(row.getValue(columnId), v);

//   // Store the itemRank info
//   addMeta({
//     itemRank,
//   });

//   // Return if the item should be filtered in/out
//   return itemRank.passed;
// };

// // Define a custom fuzzy sort function that will sort by rank if the row has ranking information
// const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//   let dir = 0;

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank!,
//       rowB.columnFiltersMeta[columnId]?.itemRank!
//     );
//   }

//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
// };

// export const columns: ColumnDef<Vocabulary>[] = [
//   {
//     accessorKey: "hangeul",
//     header: "Hangeul",
//     filterFn: fuzzyFilter,
//     sortingFn: fuzzySort,
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("hangeul")}</div>
//     ),
//   },
//   {
//     accessorKey: "translation",
//     header: () => <div>Arti</div>,
//     filterFn: fuzzyFilter,
//     sortingFn: fuzzySort,
//     cell: ({ row }) => (
//       <div className="lowercase">{row.getValue("translation")}</div>
//     ),
//   },
//   {
//     accessorKey: "chapter",
//     filterFn: "includesStringSensitive",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Bab
//         <CaretSortIcon className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="font-semibold ml-5">{row.getValue("chapter")}</div>
//     ),
//   },
//   {
//     accessorKey: "reference",
//     header: () => <div>Referensi</div>,
//     filterFn: "includesStringSensitive",
//     cell: ({ row }) => <div>{row.getValue("reference")}</div>,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Edit
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Hapus</DropdownMenuItem>
//             <DropdownMenuItem>Lapor ke admin</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export function DataTableDemo() {
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );

//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});

//   const table = useReactTable({
//     data: vocabularyData,
//     columns,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     globalFilterFn: "fuzzy",
//     filterFns: {
//       fuzzy: fuzzyFilter,
//     },
//     state: {
//       columnFilters,
//       columnVisibility,
//       globalFilter,
//     },
//   });

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Cari kosa kata..."
//           value={globalFilter ?? ""}
//           onChange={(event) => setGlobalFilter(event.target.value)}
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
