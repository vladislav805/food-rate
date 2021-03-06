import type { IGlobalContext } from '@components/GlobalContext';

type IFullPageOptions = {
    documentTitle: string;
    globalContext: IGlobalContext;
    key: string;
    initialData?: any;
};

const safeJsonStringify = (data: any) => JSON.stringify(data).replace(/</g, '\\u003c');

export const renderFullPage = (markup: string, meta: IFullPageOptions): string => {
    const { documentTitle, key, initialData, globalContext } = meta;

    return `<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover" />
        <title>${documentTitle}</title>
        <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
        <div id="Root">${markup}</div>    
        <script>
            window.__context__=${safeJsonStringify(globalContext)};
            window.__initial__=${safeJsonStringify({ key, data: initialData })};
        </script> 
        <script src="/static/index.js"></script>
    </body>
</html>
`;
};