import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        size="large"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <AccountCircleIcon/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}


export function Header(){
    return(
        <div>
            <div id="Header" style={{ display:"flex", flexDirection:"row" }}>
                <div id="Title" style={{ paddingLeft:"25px", paddingRight:"25px", flexGrow: 2}}>
                    <h1 style={{ color:"gray" }}>Dashboard</h1>
                </div>
                <div id="Profile" style={{ alignItems:"center", padding:"20px" }}>
                    <BasicMenu/>
                </div>
            </div>
            <hr style={{ border: "1px solid lightgray" }}></hr>
        </div>
    )
}