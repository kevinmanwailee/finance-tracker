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
        <AccountCircleIcon fontSize="large"/>
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
      <div id="Header" style={{ display:"flex", flexDirection:"row", backgroundColor:"#f1f1f1" }}>
        <div id="Title" style={{ display:"flex", paddingLeft:"25px", paddingRight:"25px", flexGrow: 1}}>
          <h1 style={{ color:"black" }}>Overview</h1>
        </div>
        <div id="Profile" style={{ display:"flex", alignSelf:"center", marginRigth:"20px" , borderRadius:"50px"}}>
          <BasicMenu />
        </div>
      </div>
        
    )
}