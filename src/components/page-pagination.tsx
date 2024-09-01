import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createId } from "@paralleldrive/cuid2";
import React from "react";

type Props = {
  totalRecord: number;
  currentPage: number;
  queryString: string | undefined;
};

const PagePagination: React.FC<Props> = ({
  totalRecord,
  currentPage,
  queryString,
}) => {
  const totalPage = Math.ceil(totalRecord / 20);
  const paginationLength = 3;
  const maxSequence = Math.floor(totalPage - paginationLength);
  const startIndex = currentPage <= maxSequence ? currentPage : maxSequence + 1;
  const pagination = Array.from(
    { length: paginationLength },
    (_, i) => startIndex + i
  );

  const query = new URLSearchParams(queryString);

  function getLink(page: number) {
    query.set("page", String(page));

    return `/kosa-kata?${query.toString()}`;
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getLink(currentPage - 1)}>
              Sebelumnya
            </PaginationPrevious>
          </PaginationItem>
        )}
        {pagination.map((page) => {
          const isActive = currentPage === page;
          return (
            <PaginationItem key={createId()}>
              <PaginationLink href={getLink(page)} isActive={isActive}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {currentPage <= maxSequence && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < totalPage && (
          <PaginationItem>
            <PaginationNext href={getLink(currentPage + 1)}>
              Selanjutnya
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
