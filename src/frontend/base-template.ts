import type { IGlobalContext } from '@components/GlobalContext';

type IBaseTemplateMeta = {
    documentTitle: string;
    globalContext: IGlobalContext;
    key: string;
    initialData?: any;
};

export const baseTemplate = (markup: string, meta: IBaseTemplateMeta): string => {
    const { documentTitle, key, initialData, globalContext } = meta;

    return `<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
        <div id="Root">${markup}</div>    
        <script>
            window.__context__=${JSON.stringify(globalContext)};
            window.__initial__=${JSON.stringify({ key, data: initialData })};
        </script>
        
        <script crossorigin src="https://unpkg.com/react@rc/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@rc/umd/react-dom.development.js"></script>
        
        <script src="/index.js"></script>
    </body>
</html>
`;
};