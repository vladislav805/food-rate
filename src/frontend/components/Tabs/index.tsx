import * as React from 'react';
import { tabItemCn, tabItemInputCn, tabsCn, tabsContentCn, tabsTitlesCn } from './const';

import './Tabs.scss';

type ITabsProps = React.PropsWithChildren<{
    titles: string[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}>;

const Tabs: React.FC<ITabsProps> = (props) => {
    const { selectedIndex = 0, setSelectedIndex, titles, children } = props;

    const tabs = React.Children.toArray(children);

    const onTabChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number((event.target as HTMLInputElement).value);
        setSelectedIndex(value);
    }, []);

    return (
        <div className={tabsCn}>
            <div className={tabsTitlesCn}>
                {titles.map((title, index) => {
                    const key = `tab${index}`;
                    return (
                        <React.Fragment key={key}>
                            <input
                                className={tabItemInputCn}
                                type="radio"
                                name="tabs"
                                id={key}
                                value={index}
                                onChange={onTabChange}
                                checked={selectedIndex === index}
                            />
                            <label
                                className={tabItemCn}
                                data-tab-index={index}
                                htmlFor={key}
                            >
                                {title}
                            </label>
                        </React.Fragment>
                    );
                })}
            </div>
            <div className={tabsContentCn}>
                {tabs[selectedIndex]}
            </div>
        </div>
    );
};

export default Tabs;
