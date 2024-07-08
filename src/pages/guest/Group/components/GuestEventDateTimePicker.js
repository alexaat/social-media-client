import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { useState } from 'react';

export default function GuestEventDateTimePicker({setEventDate}) {
  
    const [dateTime, setDateTime] = useState(null);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
          <DateTimePicker
            label="Event Date"
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            value={dateTime}
            onChange={(newValue) => {            
              setDateTime(newValue)
              setEventDate(Date.parse(newValue.$d))
            }}            
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  }