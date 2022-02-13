import * as React from 'react';
import withAnimateVisibility from '@components/withAnimateVisibility';
import type { IAnimateVisibilityStyleObject } from '@components/withAnimateVisibility';

import './Overlay.scss';

interface IOverlayProps {
    onClick?: () => void;
}

const Overlay: React.FC<IOverlayProps & IAnimateVisibilityStyleObject> = props => {
    const { animateStyles, onClick } = props;
    return (
        <div
            className="Overlay"
            style={animateStyles}
            onClick={onClick}
        />
    );
};

export default withAnimateVisibility(Overlay, {
    inName: 'fadeIn',
    outName: 'fadeOut',
    duration: 200,
    hard: true,
});
