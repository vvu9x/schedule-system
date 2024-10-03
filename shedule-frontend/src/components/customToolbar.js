import React from 'react';
import { Button, IconButton, Typography, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const CustomToolbar = ({ date, view, onView, onNavigate, onSearch, searchUser,setSearchUser }) => {

  const goToBack = () => {
    onNavigate('PREV'); 
  };

  const goToNext = () => {
    onNavigate('NEXT');  
  };

  const goToToday = () => {
    onNavigate('TODAY');  
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      onView(nextView);
    }
  };

  const handleSearchChange = (event) => {
    setSearchUser(event.target.value);  
    onSearch(event.target.value);  
  };

  const label = () => {
    const currentDate = date;
    return `${currentDate.toLocaleString('en-US', { month: 'long' }).toUpperCase()} ${currentDate.getFullYear()}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', marginRight: '16px' }}>
          {label()}
        </Typography>
        <Button variant="outlined" onClick={goToToday} style={{ marginRight: '8px' }}>Today</Button>
        <IconButton onClick={goToBack}>
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={goToNext}>
          <ArrowForwardIos />
        </IconButton>
      </div>
      <TextField
        variant="outlined"
        placeholder="Search employees"
        value={searchUser} 
        onChange={handleSearchChange}  
        style={{ marginRight: '16px', width: '250px' }}
      />

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="View switcher"
      >
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default CustomToolbar;
