import { useParams } from 'react-router-dom';
import { GroupsProvider } from '../../context/GroupsContext';
import Page from './components/Page'
import { EventsProvider } from '../../context/EventsContext';

const Group = () => {

    const { group_id } = useParams();

    return (
        group_id &&
        <GroupsProvider group_id={group_id}>
            <EventsProvider groupId={group_id}>
                <Page group_id={group_id} />
            </EventsProvider>
        </GroupsProvider>
    )
}

export default Group;