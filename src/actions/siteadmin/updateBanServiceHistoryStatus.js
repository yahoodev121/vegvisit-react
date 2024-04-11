import { gql } from 'react-apollo';
import { sendEmail } from '../../core/email/sendEmail';
// Toaster
import { toastr } from 'react-redux-toastr';
import { adminEmail } from '../../config';
const adminMail = adminEmail;
const query = gql`
query userManagement($currentPage: Int, $searchList: String){
    userManagement(currentPage: $currentPage, searchList: $searchList) {
      count
      usersData{
        id,
          email,
          profile
          {
          profileId,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          preferredLanguage,
          preferredCurrency,
          location,
          info,
          createdAt
          },
          userBanStatus,
      }
     }
  }
`;
const mutation = gql`
  mutation($id: String, $banStatus: Int) {
    updateBanServiceHistoryStatus(id: $id ,banStatus: $banStatus){
      status
      }
    }
  `;
export function updateBanServiceHistoryStatus(id, banStatus, userMail, userName, currentPage, searchList) {

    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.mutate({
                mutation,
                variables: { id, banStatus },
                fetchPolicy: 'network-only',
                refetchQueries: [{ query, variables: { currentPage , searchList} }]
            });
            if ((data.updateBanServiceHistoryStatus.status === "success")) {
                let mailData = {
                    userName,
                    userMail,
                    adminMail
                }
                toastr.success('Update Ban Status', "Ban Status updated successfully");
                if (banStatus === '1') {
                    await sendEmail(userMail, 'banStatusServiceStatusBanned', mailData);
                } else if (banStatus === '0') {
                    await sendEmail(userMail, 'banStatusServiceStatusUnBanned', mailData);
                }
            } else {
                toastr.error('Update Ban Status', "Ban Status updation failed");
            }
        } catch (error) {
            toastr.warning('Select Ban/Unban', "You have to select either one option ban/unban");
            return false;
        }
        return true;
    };
}
