// import React from 'react'
import emailjs from "@emailjs/browser";
import { Box, Button, TextField } from "@mui/material";
import { useRef } from "react";
import "./Join.css";

const Join = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_nzs8pke",
        "template_fmx0qzc",
        form.current,
        "tBZaG9X87GBxE6-mh"
      )
      .then(
        (result) => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="Join" id="join-us">
      <div className="left-j">
        <hr />
        <div>
          <span className="stroke-text">READY TO</span>
          <span>LEVEL UP</span>
        </div>
        <div>
          <span>YOUR BODY</span>
          <span className="stroke-text"> WITH US ?</span>
        </div>
      </div>
      <div className="right-j">
        <Box
          component="form"
          ref={form}
          className="email-container"
          onSubmit={sendEmail}
          noValidate
        >
          <TextField
            type="email"
            name="user_email"
            placeholder="Enter your Email address"
            size="small"
            fullWidth
            required
            inputProps={{ "aria-label": "Email address" }}
          />
          <Button type="submit" variant="contained" className="btn btn-j">
            Join Now
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Join;
