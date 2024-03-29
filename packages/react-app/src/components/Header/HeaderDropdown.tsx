import type { DropDownProps } from 'antd/es/dropdown';
import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
// import styles from './headerDropdown.less';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./headerDropdown.less');

export type HeaderDropdownProps = {
  overlayClassName?: string;
  overlay: React.ReactNode | (() => React.ReactNode) | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}: HeaderDropdownProps) => <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />;

export default HeaderDropdown;
