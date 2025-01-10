

function BranchButton({ branch }: { branch: object }) {
    return (
        <div className="border p-4">
            {branch.landmark}
        </div>
    );
}

export default BranchButton;
