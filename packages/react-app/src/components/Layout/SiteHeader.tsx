import React from 'react';
import { Layout, PageHeader } from 'antd';
import './SiteHeader.less';
import { NavLink } from 'react-router-dom';

interface SiteHeaderProps {
  account: JSX.Element;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ account }: SiteHeaderProps) => {
  const baseClassName = 'SiteHeader';

  return (
    <div className={baseClassName}>
      <Layout.Header className={`${baseClassName}-header-layout`}>
        <PageHeader
          title="🖼 NFT Canvas"
          subTitle="Collaborative, programmable art"
          style={{ cursor: 'pointer' }}
          extra={<>{account}</>}
        />
      </Layout.Header>
    </div>
  );
};

export default SiteHeader;
