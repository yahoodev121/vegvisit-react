import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import ViewMessage from './ViewMessage';
import Layout from '../../components/Layout';
import NotFound from '../notFound/NotFound';
import { loadAccount } from '../../actions/account';
const title = 'View Message';
export default {
  path: '/message/:threadId/:type',
  async action({ store, params }) {
    await store.dispatch(loadAccount());
    // From Redux Store
    const isAuthenticated = store.getState().runtime.isAuthenticated;
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const isAccount = store.getState().account.data;
    let userBanStatus;
    if (isAccount) {
      userBanStatus = isAccount.userBanStatus;
    }
    // From URL
    const threadId = Number(params.threadId);
    const userType = params.type;
    if (!isAdminAuthenticated) {
      if (!isAuthenticated) {
        return { redirect: '/login' };
      }
    }
    if (userType != 'host' && userType != 'guest' || userBanStatus) {

      return {
        title,
        component: <Layout><NotFound title={title} /></Layout>,
        status: 404
      };
    }
    return {
      title,
      component: <UserLayout>
        <ViewMessage
          threadId={threadId}
          userType={userType}
        />
      </UserLayout>,
    };
  },
};
