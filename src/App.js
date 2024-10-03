import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { PermanentSidebar } from './PermanentSidebar.js';
import { Header } from './Header.js';
import { Stack } from '@mui/material';
import { Button, TextField, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function NewTransaction() {
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
            console.log(formJson);
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
            <Stack sx={{ flexDirection:"row", paddingBottom:"30px" }}>
              <TextField
                autoFocus
                required
                id="title"
                name="title"
                label="Name"
                sx={{ paddingRight:"20px" }}
              />
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                type="number"
                defaultValue="0.00"
                />
            </Stack>
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
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const URL = 'http://127.0.0.1:9000/transactions';

  let fetchData = useCallback(async () =>{
    const res = await axios.get(URL);
    if(res){
      setPosts(res.data)
    }
  },[])

  useEffect(() => {
    fetchData()
  },[])

  function newPost(){
    axios.put(URL, {
      title: newTitle,
      category: newCategory,
      price: newPrice
    })
  }

  function deletePost(){
    axios.delete(URL)
    .then(() => {
      alert("Deleted!");
      setPosts(null);
    })
  }

  const colWidth = { xs: 12, sm: 6, md: 4, lg: 3 };  return (
    <div style={{ display:"flex", alignItems:"stretch"}}> 
      <div id="Sidebar">
        <PermanentSidebar/>
      </div>
      <Stack sx={{ display:"flex", flexGrow: 4, flexDirection:"column" }}>
        <Header/>
        <Stack>
          <Stack sx={{ alignItems:"center"}}>
            <div>
              <NewTransaction/>
            </div>
          </Stack>
          <ul>
            {posts.map(post =>
              <div key={post.id}>
                <h1 >{post.title}</h1>
                <p>{post.category}</p>
                <p>${post.price.toFixed(2)}</p>
              </div>
            )}
          </ul>
        </Stack>

      </Stack>
    </div>
  );
}

export default App;
