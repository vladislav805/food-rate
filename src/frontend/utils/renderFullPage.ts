import type { IGlobalContext } from '@components/GlobalContext';

type IFullPageOptions = {
    documentTitle: string;
    globalContext: IGlobalContext;
    key: string;
    initialData?: any;
};

export const renderFullPage = (markup: string, meta: IFullPageOptions): string => {
    const { documentTitle, key, initialData, globalContext } = meta;

    return `<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
        <div id="Root">${markup}</div>    
        <script>
            window.__context__=${JSON.stringify(globalContext)};
            window.__initial__=${JSON.stringify({ key, data: initialData })};
        </script> 
        <script src="/static/index.js"></script>
    </body>
</html>
`;
};