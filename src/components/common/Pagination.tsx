// src/components/common/Pagination.tsx
import React from "react";
import { Pagination as MuiPagination, PaginationItem } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(_, page) => onPageChange(page)}
      color="primary"
      size="large"
      showFirstButton
      showLastButton
      siblingCount={1}
      boundaryCount={1}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component="button"
          onClick={() => item.page !== null && onPageChange(item.page)}
        />
      )}
    />
  );
};

export default Pagination;
