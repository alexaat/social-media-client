import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const HomeGuest = () => {
    
    //Navigation
    const navigate = useNavigate();


    
    return (
        <div>
            Home
            <Button variant="contained" size="medium" color="success" onClick={() => navigate('/guest/profile')}>Profile</Button>
        </div>
      );
}
 
export default HomeGuest;