import React, { memo } from 'react';
import { cls } from '../../utils/classname';
import { Button, ButtonProps } from '../components/Button/button.component';
import * as classes from './controls.module.css';

export type ClearButtonProps = {

} & ButtonProps;

export const ClearButton = memo(({ children, ...props }: ClearButtonProps) => {
  return (
    <Button className={cls(classes.button, classes['button-i'])} title={'Clear'} {...props}>
      <div className={classes['clear-i']}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="m20.46 11.992c0-.018 0-.038 0-.059 0-1.69-.507-3.261-1.376-4.571l.019.031-11.757 11.74c1.296.87 2.89 1.388 4.606 1.388h.026-.001.029c1.182 0 2.306-.25 3.321-.699l-.052.021c3.074-1.315 5.188-4.314 5.188-7.807 0-.015 0-.03 0-.045v.002zm-15.576 4.662 11.773-11.757c-1.29-.889-2.886-1.42-4.607-1.42-.025 0-.05 0-.074 0h.004c-.019 0-.041 0-.064 0-1.546 0-2.992.423-4.231 1.159l.038-.021c-2.544 1.51-4.223 4.244-4.223 7.369 0 1.736.518 3.352 1.408 4.7l-.02-.032zm19.066-4.662v.035c0 1.678-.35 3.273-.981 4.718l.03-.076c-1.842 4.36-6.082 7.363-11.024 7.363s-9.182-3.004-10.994-7.285l-.029-.078c-.601-1.379-.951-2.985-.951-4.674s.35-3.295.981-4.751l-.03.077c1.842-4.36 6.082-7.363 11.024-7.363s9.182 3.004 10.994 7.285l.029.078c.601 1.365.952 2.957.952 4.631v.041-.002z"><path d="m20.46 11.992c0-.018 0-.038 0-.059 0-1.69-.507-3.261-1.376-4.571l.019.031-11.757 11.74c1.296.87 2.89 1.388 4.606 1.388h.026-.001.029c1.182 0 2.306-.25 3.321-.699l-.052.021c3.074-1.315 5.188-4.314 5.188-7.807 0-.015 0-.03 0-.045v.002zm-15.576 4.662 11.773-11.757c-1.29-.889-2.886-1.42-4.607-1.42-.025 0-.05 0-.074 0h.004c-.019 0-.041 0-.064 0-1.546 0-2.992.423-4.231 1.159l.038-.021c-2.544 1.51-4.223 4.244-4.223 7.369 0 1.736.518 3.352 1.408 4.7l-.02-.032zm19.066-4.662v.035c0 1.678-.35 3.273-.981 4.718l.03-.076c-1.842 4.36-6.082 7.363-11.024 7.363s-9.182-3.004-10.994-7.285l-.029-.078c-.601-1.379-.951-2.985-.951-4.674s.35-3.295.981-4.751l-.03.077c1.842-4.36 6.082-7.363 11.024-7.363s9.182 3.004 10.994 7.285l.029.078c.601 1.365.952 2.957.952 4.631v.041-.002z"/></path>
        </svg>
      </div>
    </Button>
  );
});