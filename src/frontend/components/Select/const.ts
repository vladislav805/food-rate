import { cn } from '@bem-react/classname';

const cnSelect = cn('Select');

export const selectCn = cnSelect();
export const selectValueCn = cnSelect('Value');
export const selectModalCn = cnSelect('Modal');
export const cnSelectItem = cn('Select', 'Item');
export const selectItemIconCn = cnSelectItem('ItemIcon');
export const selectItemTitleCn = cnSelectItem('ItemTitle');
export const selectItemActiveIconCn = cnSelectItem('ItemActiveIcon');
