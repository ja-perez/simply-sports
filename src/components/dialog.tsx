'use client';
import { useState } from 'react';

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Typography } from '@mui/material';

export function UnderConstruction({ isProd }: { isProd: true | false}) {
    const [seen, setSeen] = useState(isProd ? false : true);
    const [open, setOpen] = useState(isProd ? true: false);

    const handleClose = () => {
        setOpen(false);
        setSeen(true);
    };

    return (
        <>
        {seen
        ? null
        :
        <Dialog
            onClose={handleClose}
            aria-labelledby="dialog-title"
            open={open}
            >
            <DialogTitle>
                Page Notice
                </DialogTitle>
            <IconButton
                autoFocus
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                })}
                >
                <CloseIcon />
                </IconButton>
            <DialogContent dividers>
                <Typography gutterBottom>
                    This page is currently under construction!
                </Typography>
                </DialogContent>
            </Dialog>
        }
        </>
    )
}