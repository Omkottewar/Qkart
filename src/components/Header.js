import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import {Link,useHistory} from 'react-router-dom';
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

  let history = useHistory();

  let userName = localStorage.getItem("username")


  const clear=()=>{
    localStorage.clear();
    window.location.reload();
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}
        {hasHiddenAuthButtons?(
          <button
          className="explore-button"
          startIcon={<ArrowBackIcon/>}
          variant="text"
          onClick={()=>{history.push("/")}}
          >
            Back to Explore
          </button> 
        ):(userName?(
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt={userName} src="/public/avatar.png"/>
            <p>{userName}</p>
            <Button variant="contained"
            onClick={clear}
            >LOGOUT</Button>
          </Stack>
        ):(
          <Stack direction="row" spacing={2}>
            <Button variant="contained"
            onClick={(e)=>{history.push("/login")}}
            >
              LOGIN
            </Button>
            <Button variant="contained" onClick={(e)=>{history.push("/register")}}>REGISTER</Button>
          </Stack>
        ))
      
      }
       
      </Box>
    );
};

export default Header;