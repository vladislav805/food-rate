import * as React from 'react';
import type { IBranch } from '@typings/objects';

type IBranchListProps = {
    branches: IBranch[];
};

const BranchList: React.FC<IBranchListProps> = ({ branches }) => {
    return (
        <div>
            <ul>
                {branches.map(branch => (
                    <li key={branch.id}>{branch.address}</li>
                ))}
            </ul>
        </div>
    );
};

export default BranchList;
