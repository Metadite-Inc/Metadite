
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ModelPagination = ({ currentPage, totalPages, handlePageChange }) => {
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) return null;

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    let pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      pages.push(1);
      
      // Calculate middle range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to ensure we show the correct number of pages
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <Pagination className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious 
              onClick={goToPreviousPage} 
              className={`${currentPage === 1 
                ? "pointer-events-none opacity-50" 
                : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Previous</span>
            </PaginationPrevious>
          </PaginationItem>
          
          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {/* Next Button */}
          <PaginationItem>
            <PaginationNext 
              onClick={goToNextPage} 
              className={`${currentPage === totalPages 
                ? "pointer-events-none opacity-50" 
                : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ModelPagination;
