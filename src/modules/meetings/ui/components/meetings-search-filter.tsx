import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    return (
        <div className="relative">
            <Input
                className="h-9 bg-white w-[200px] pl-7"
                placeholder="Search agents..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}