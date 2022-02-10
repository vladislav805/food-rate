import { cn } from '@bem-react/classname';

const cnCategoryList = cn('CategoryList');
export const categoryListCn = cnCategoryList();
export const categoryListContentCn = cnCategoryList('Content');
export const cnCategoryListItem = cn(cnCategoryList('Item'));
export const categoryListLinkCn = cnCategoryList('Link');
