import { Input } from "./ui/input";

function BranchSearch({ search, setSearch }: { search: string, setSearch: (search: string) => void }) {
    return (
        <div className="p-4">
            <Input placeholder="Search for a branch" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
    );
}


export default BranchSearch;
