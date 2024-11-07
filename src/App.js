import React, {useState, useEffect} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { PermanentSidebar } from './PermanentSidebar.js';
import { Header } from './Header.js';
import { BarChart } from '@mui/x-charts/BarChart'
import { Stack } from '@mui/material';
import { Button, TextField, MenuItem, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { List, ListItem, ListItemText } from '@mui/material';
import  Grid from '@mui/material/Grid2';

function NewTransaction(props) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const categories = [
    { value:'Income', },
    { value:'Bills', },
    { value:'Food', },
    { value:'Subscriptions', },
    { value:"Recreation",},
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
            console.log(formData);
            props.newPost(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add new transaction</DialogTitle>
        <DialogContent>
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
                  <DatePicker 
                    label="Date" 
                    id="date"
                    name="date"
                    defaultValue={dayjs()}/>
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
                defaultValue="Food"
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
  const [graph, setGraph] = useState([]);
  const [monthText, setMonthText] = useState(dayjs().format('MMMM'));
  const [monthNum, setMonthNum] = useState(dayjs().format('MM'));
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const URL = 'http://127.0.0.1:9000/';

  async function fetchData(){
    // const res = await axios.get(URL+"transactions");
    console.log("GET: " + monthNum + "/" + year);
    const res = await axios.get(URL+"transactions/dateMY/"+ monthNum + "/" + year);
    if(res){
      setPosts(res.data)
      
      const response = await axios.get(URL+"transactions/categoryArray/"+ monthNum + "/" + year);
      if(response){
        setGraph(response.data);
      }
    }
  }
  useEffect(() => {
    const day = dayjs(new Date(year, monthNum-1, 1));
    setMonthText(day.format('MMMM'));
    setMonthNum(monthNum);
    fetchData();
  },[monthNum, year])

  async function deletePost(id){
    console.log(URL+"Delete/"+id);
    await axios.delete(URL+"Delete/"+id)
    .then((response) => {
      console.log(response.data)
      fetchData();
      })
      .catch((error) =>{
        console.log(error)
      })
  }

  async function newPost(jsonObj){
    await axios.put(URL+"AddTransaction/", jsonObj)
      .then((response) => {
        console.log(response.data)
        fetchData()
    })
      .catch((error) => {
        console.log(error)
      })
  }
  
  function MonthSelector(props){
    const {
      setOpen,
      label,
      id,
      disabled,
      InputProps: { ref } = {},
      inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    const onClickLeft = () => {
      var temp = monthNum;
      if(temp !== 1 ){ temp = temp - 1; } 
      else{ 
        temp = 12;
        setYear(year-1);
      }
      setMonthNum(temp);
    };
    const onClickRight = () => {
      var temp = Number(monthNum);
      if(temp !== 12 ){ temp = temp+1; } 
      else{ 
        temp = 1; 
        setYear(Number(year)+1);
      }
      setMonthNum(temp);
    };

    return(
      <Stack sx={{ flexDirection:"row", paddingLeft:"30px" }}>
        <IconButton aria-label="left" 
          disabled-color="primary"
          onClick={onClickLeft}>
          <ChevronLeftIcon/>
        </IconButton>
        <Button 
          variant="text"
          color="disabled"
          id={id}
          disabled={disabled}
          ref={ref}
          aria-label={ariaLabel}
          onClick={() => setOpen?.((prev) => !prev)}
          sx={{width:"140px"}}
          >          
          {monthText + " " + year}
        </Button>
        <IconButton aria-label="left" 
          disabled-color="primary"
          onClick={onClickRight}>
          <ChevronRightIcon/>
        </IconButton>
      </Stack>
    )
  }

  function ButtonDatePicker(props, {monthNum, year}) {
    const [open, setOpen] = React.useState(false);
  
    return (
      <DatePicker
        openTo="month"
        views={['year', 'month']}
        slots={{ ...props.slots, field: MonthSelector }}
        slotProps={{ ...props.slotProps, field: { setOpen } }}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        onChange={(event)=>{
          setYear(event["$y"])
          setMonthNum(event["$M"]+1)
        }}
        
      />
      
    );
  }

  return (
    <div style={{ display:"flex", alignItems:"stretch"}}> 
      <Stack>
        <PermanentSidebar/>
      </Stack>
      <Stack sx={{ display:"flex", flexGrow: 4, flexDirection:"column" }}>
        <Header/>
        <Stack>
          {/* <MonthSelector/> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker monthNum={this.monthNum} year={this.year}/>
          </LocalizationProvider>
          <Stack sx={{ margin:"20px", padding:"20px", border:"1px solid lightGray", minWidth:"95%", minHeight:"300px"}}>
            <BarChart
              yAxis={[{ 
                scaleType:'band', 
                dataKey: 'type',
              }]}
              xAxis={[{ tickMinStep:50}]}
              dataset={[graph]}
              series={[
                { dataKey: 'Food', stack: 'Expenses', label:'Food', color:"lightCoral" },
                { dataKey: 'Recreation', stack: 'Expenses', label:'Recreation', color:"lightblue"},
                { dataKey: 'Remaining', stack: 'Remaining', label:'Remaining', color:"lightgray" },
              ]}
              layout="horizontal"
              />
          </Stack>
          <Stack sx={{ padding:"30px", paddingTop:"10px"}}>
            <Stack sx={{width:"200px", paddingBottom:"10px"}}>
              <NewTransaction newPost={newPost}/>
            </Stack>
            <Grid 
            container 
            spacing={4}
            sx={{ 
              '--Grid-borderWidth': '1px',
              border: 'var(--Grid-borderWidth) solid',
              borderColor: 'divider'
             }}
            >
              <Grid key="Transaction List" size={12}>
                <List dense>  
                  {posts.map(post =>
                    <ListItem key={post._id}>
                      <Grid size={2.5}>
                        <ListItemText>{post.date}</ListItemText>
                      </Grid>
                      <Grid size={4}>
                        <ListItemText>{post.title}</ListItemText>
                      </Grid>
                      <Grid size={3}>
                        <ListItemText>{post.category}</ListItemText>
                      </Grid>
                      <Grid size={2}>
                        <ListItemText>{"$"+Number(post.price).toFixed(2)}</ListItemText>
                      </Grid>
                      <Grid size={1}>
                        <Button variant="outlined" onClick={() => deletePost(post._id)}>
                          Delete
                        </Button>
                      </Grid>
                    </ListItem>
                    )}
                  </List>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
