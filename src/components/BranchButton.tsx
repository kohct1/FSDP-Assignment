

function BranchButton({ branch, setSelectedBranch }: { branch: object, setSelectedBranch: (branch: object) => void }) {
    function handleClick(): void {
        setSelectedBranch(branch);
    }

    return (
        <div className="border-b p-4" onClick={handleClick}>
            {branch.landmark}
        </div>
    );
}

export default BranchButton;
