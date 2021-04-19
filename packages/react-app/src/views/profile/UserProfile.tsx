import React, { useEffect, useState } from 'react';
import { Avatar, Button, Input, Layout, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { BasicProfile } from '@ceramicstudio/idx-constants';
import * as AntIcon from '@ant-design/icons';
import { ethAddressToDID } from '../../apis/ceramic';
import { useCeramicContext } from '../../contexts';
import { AccountModelType } from '../../subgraph_models';
import { useQuery as useMstQuery } from '../../subgraph_models/reactUtils';

const { Title, Paragraph } = Typography;

type UserParams = {
  userAddress: string;
};

const UserProfile: React.FC = () => {
  const { userAddress } = useParams<UserParams>(); // gotten from the route...
  const [profileInfo, setProfileInfo] = useState<BasicProfile>({});
  const [userAccount, setUserAccount] = useState<AccountModelType>();

  const { data, error, loading } = useMstQuery<{ account: AccountModelType }>(store =>
    store.queryAccount({ id: userAddress }),
  );

  // now need to ask ceramic for this user's profile

  const ceramicAuth = useCeramicContext();

  if (data?.account) {
    console.log(data.account.accountDid);
  }

  useEffect(() => {
    console.log(data);
    if (data?.account) {
      data.account.fetchAccountDid(ceramicAuth);
    }
  }, [ceramicAuth, data]);

  const setUserProfile = async () => {
    const test = ceramicAuth.setUserProfile(profileInfo);
    console.log(test);
  };

  const getUserProfile = () => {
    const bas = ceramicAuth.getUserProfile();
    console.log(bas);
  };

  const handleChangeText = (key: string, changedText: string) => {
    const userProfile = profileInfo;
    userProfile[key] = changedText;
    setProfileInfo(userProfile);
  };

  return (
    <Layout>
      <div className="UserProfile">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            margin: '18px 0px',
            borderBottom: '1px solid grey',
          }}
        >
          <Avatar size={80} src={profileInfo.image} icon={<AntIcon.UserOutlined />} />
          <div>
            <Title level={5}>{profileInfo.name}</Title>
          </div>
        </div>
        <div className="user-info">
          <Paragraph>
            <blockquote>{profileInfo.description}</blockquote>
          </Paragraph>
        </div>

        <Input
          placeholder="Your Name"
          // value={profileInfo.name}
          onChange={event => handleChangeText('name', event.target.value)}
        />
        <Input
          placeholder="Description"
          // value={profileInfo.description}
          onChange={event => handleChangeText('description', event.target.value)}
        />
        <Input
          placeholder="URL"
          // value={profileInfo.url}
          onChange={event => handleChangeText('url', event.target.value)}
        />
        <Button className="mt-3 max-w-xs" onClick={setUserProfile}>
          Set profile
        </Button>
        <Button className="mt-3 max-w-xs" onClick={getUserProfile}>
          Get profile
        </Button>
      </div>
    </Layout>
  );
};

export default UserProfile;
