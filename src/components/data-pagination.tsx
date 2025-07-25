import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const DataTablePagination = ({ page, totalPages, onPageChange }: DataTablePaginationProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                <span>
                    Page {page} of {totalPages || 1}
                </span>
            </div>
            <div className="flex items-center justify-end gap-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0}>
                    Next
                </Button>
            </div>
        </div>
    )
}