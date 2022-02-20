import * as React from 'react';

export type ISearchSuggestContext = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

export const SearchSuggestContext = React.createContext<ISearchSuggestContext>({} as ISearchSuggestContext);
