import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';

const TodaySchedule = ({ events, selectedDate }) => {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const filteredEvents = events.filter(event => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
    return eventDate === formattedDate;
  });

  return (
    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Typography variant="h6">Events</Typography>
      <List>
        {filteredEvents.map(event => (
          <ListItem key={event.id}>
            <ListItemText
              primary={`${event.title}`}
              secondary={`${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodaySchedule;
