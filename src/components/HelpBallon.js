// components/HelpBalloon.js
import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './HelpBallon';

const HelpBalloon = ({ message }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="help" 
        onClick={handleClickOpen} 
        className="fab-help"
      >
        <HelpOutlineIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} className="dialog-help">
        <DialogTitle>Ajuda</DialogTitle>
        <DialogContent>
          <div>{message}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpBalloon;
