import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import GuestApproveJoinGroupRequest from "./GuestApproveJoinGroupRequest";

const NewMemberRequestsApproveDialog = ({open, onClose, requests, approveMember, declineMember}) => {
      
    return ( 
        <Dialog
            PaperProps={{
                sx: {
                    minWidth: '400px', minHeight: '450px', p: 0, m: 0
                },
            }}
            open={open}
            onClose={onClose}>
            <DialogTitle>
                Approve New Members
            </DialogTitle>
            <DialogContent>
                 {
                    requests && requests.map(request => <GuestApproveJoinGroupRequest
                                                            sx={{ p: 1}}
                                                            key={request.group.id} 
                                                            user={request.sender}
                                                            group={request.group}
                                                            approveHandler={approveMember}
                                                            declineHandler={declineMember}/>)
                } 
           

            </DialogContent>

        </Dialog>


     );
}
 
export default NewMemberRequestsApproveDialog;