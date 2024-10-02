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
  const totalPerPage = 20;
  const totalPage =
    totalRecord <= totalPerPage ? 1 : Math.ceil(totalRecord / totalPerPage);
  const paginationLength = Math.min(totalPage, 3);
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
            <PaginationPrevious
              className="max-[400px]:pr-0.5"
              href={getLink(currentPage - 1)}
            >
              Sebelumnya
            </PaginationPrevious>
          </PaginationItem>
        )}
        {currentPage > paginationLength && (
          <>
            <PaginationItem>
              <PaginationLink
                className="max-sm:w-8 max-sm:h-8"
                href={getLink(1)}
                isActive={currentPage === 1}
              >
                {1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="max-sm:w-8 max-sm:h-8" />
            </PaginationItem>
          </>
        )}
        {pagination.map((page) => {
          const isActive = currentPage === page;
          return (
            <PaginationItem key={createId()}>
              <PaginationLink
                className="max-sm:h-8 max-sm:w-8"
                href={getLink(page)}
                isActive={isActive}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {currentPage <= maxSequence && (
          <>
            <PaginationItem>
              <PaginationEllipsis className="max-sm:w-8 max-sm:h-8" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="max-sm:w-8 max-sm:h-8"
                href={getLink(totalPage)}
                isActive={currentPage === totalPage}
              >
                {totalPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {currentPage < totalPage && (
          <PaginationItem>
            <PaginationNext
              className="max-[400px]:pl-0.5"
              href={getLink(currentPage + 1)}
            >
              Selanjutnya
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
