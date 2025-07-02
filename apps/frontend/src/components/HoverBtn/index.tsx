import React, { ReactElement, useCallback, useMemo, cloneElement, memo } from 'react';
import { Tooltip, Button } from 'antd';
import type { ITooltipProps } from './types';
import { clipboard as clipboardFun } from '../../utils/utils';
import './index.scoped.scss';

/**
 * 悬浮操作
 */
function HoverBtn(props: ITooltipProps) {

  const {
    children,
    clipboard,
    extra,
    className = '',
    style
  } = props

  const handleCopy = useCallback((e: any) => {
    e.stopPropagation();
    clipboard && clipboardFun(clipboard)
  }, [clipboard])

  const operateList = useMemo<ReactElement[]>(() => {
    const _operateList: ReactElement[] = []
    if (clipboard) {
      _operateList.push(
        <Button
          type="primary"
          size="small"
          onClick={handleCopy}
        >
          复制
        </Button>
      )
    }

    if (extra && extra.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _operateList.push(...extra.filter(Boolean).map((item) => cloneElement(item, { size: 'small' })));
    }
    return _operateList;
  }, [clipboard, extra, handleCopy]);

  const titleNode: React.ReactNode = useMemo(() => (
    <div className="title_node_box">
      {operateList.map((item, index: number) => (
        item ?
          (
            <div
              key={index}
              className="element"
            >
              {item}
            </div>
          ) : null
      ))}
    </div>
  ), [operateList]);

  if (operateList.length <= 0) return <>{children}</>;

  return (
    <Tooltip
      title={titleNode}
      placement="top"
      color="#fff"
      autoAdjustOverflow
      arrow
      overlayClassName="tooltip_container"
      mouseLeaveDelay={.2}
    >
      <span
        className={`hover_btn_box ${className}`}
        style={{ ...style }}>
        {children}
      </span>
    </Tooltip>
  );
}

export default memo(HoverBtn)
