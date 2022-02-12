import { cn } from '@bem-react/classname';

const cnButton = cn('Button');
export const buttonCn = cnButton();
export const buttonPressedCn = `${buttonCn}_pressed`;
