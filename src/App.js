import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { PermanentSidebar } from './PermanentSidebar.js';
import { Header } from './Header.js';
import { Stack } from '@mui/material';
import { Button, TextField, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function NewTransaction(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const categories = [
    {
      value:'Income',
    },
    {
      value:'Food',
    },
    {
      value:"Recreaction",
    },
  ]

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Transaction
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            props.newPost(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add new transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Test
          </DialogContentText>
          <Stack>
            <Stack sx={{ paddingBottom:"30px" }}>
              <TextField
                autoFocus
                required
                id="title"
                name="title"
                label="Name"
              />
            </Stack>
            <Stack sx={{ flexDirection:"row", paddingBottom:"30px" }}>
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                type="number"
                defaultValue="0.00"
                sx={{ paddingRight:"30px", marginTop:"8px" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker label="Date" defaultValue={dayjs()}/>
                </DemoContainer>
              </LocalizationProvider>
            </Stack>
            <Stack>
              <TextField
                select
                required
                id="category"
                name="category"
                label="Category"
                defaultValue="Income"
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


function App() {
  const [posts, setPosts] = useState([]);
  const URL = 'http://127.0.0.1:9000/';

  let fetchData = useCallback(async () =>{
    const res = await axios.get(URL+"transactions");
    if(res){
      setPosts(res.data)
    }
  },[])

  useEffect(() => {
    fetchData()
  },[])

  function newPost(jsonObj){
    console.log("Sending: " + jsonObj)
    axios.put(URL+"AddTransaction/", jsonObj)
      .then((response) => {
        console.log(response.data)
        fetchData()
    })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div style={{ display:"flex", alignItems:"stretch"}}> 
      <div id="Sidebar">
        <PermanentSidebar/>
      </div>
      <Stack sx={{ display:"flex", flexGrow: 4, flexDirection:"column" }}>
        <Header/>
        <Stack>
          <Stack sx={{ alignItems:"center"}}>
            <div>
              <NewTransaction newPost={newPost}/>
            </div>
          </Stack>
          <ul>
            {posts.map(post =>
              <div key={post.id}>
                <h1 >{post.title}</h1>
                <p>{post.category}</p>
                <p>${post.price}</p>
              </div>
            )}
          </ul>
        </Stack>

      </Stack>
    </div>
  );
}

export default App;
