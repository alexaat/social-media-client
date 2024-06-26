import { useNavigate, useParams } from "react-router-dom";


const ProfileGuest = () => {
    
    const { person_id } = useParams();






    
    return (
        <div>
            Profile for {person_id}
           
        </div>
      );
}
     

 
export default ProfileGuest;


