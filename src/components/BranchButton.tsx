function BranchButton({ branch, setSelectedBranch }: { branch: object, setSelectedBranch: (branch: object) => void }) {
    function handleClick(): void {
        setSelectedBranch(branch);
    }

    return (
        <div className="border-b p-4 cursor-pointer hover:font-semibold" onClick={handleClick}>
            <h1>{branch.landmark}</h1>
        </div>
    );
}

export default BranchButton;
