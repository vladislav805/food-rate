import * as React from 'react';
import type { IBranch } from '@typings/objects';
import { branchListCn, branchListItemCn } from './const';

import './BranchList.scss';

type IBranchListProps = {
    branches: IBranch[];
};

const BranchList: React.FC<IBranchListProps> = ({ branches }) => {
    return (
        <ul className={branchListCn}>
            {branches.map(branch => (
                <li
                    key={branch.id}
                    className={branchListItemCn}
                >
                    {branch.address}
                </li>
            ))}
        </ul>
    );
};

export default BranchList;
