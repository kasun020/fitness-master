import React from 'react';
import {AppBar, Button, DialogContent, IconButton, Stack, Toolbar} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {create} from "zustand";
import CancelIcon from "@mui/icons-material/Cancel";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {Link} from "react-router-dom";
import {FileDownloadService} from "../../assets/_services/file-download-service";
import fileDownload from "js-file-download";

type FileViewerStore = {
    file: string;
    zoom: number,
    fileDownloading: boolean,
    close: boolean;
};

const useFileViewerStore = create<FileViewerStore>(() => ({
    file: "",
    zoom: 1,
    fileDownloading: false,
    close: false,
}));

export const openFileViewer = (
    image: string,
) => {
    useFileViewerStore.setState({
        file: image,
        zoom: 1,
        fileDownloading: false,
        close: true,
    });
};

export const closeImageViewer = () => {
    useFileViewerStore.setState({
        close: false,
    });
};

function FileViewer() {

    const {file, zoom, fileDownloading, close} = useFileViewerStore();

    const handleDownload = (url: any) => {
        useFileViewerStore.setState({fileDownloading: true});
        FileDownloadService.downloadFile(url).then(
            response => {
                if (response.isSuccess) {
                    useFileViewerStore.setState({fileDownloading: false});
                    fileDownload(response.data, url.substring(url.lastIndexOf('/') + 1))
                } else {
                    useFileViewerStore.setState({fileDownloading: false});
                }
            }
        );
    }

    const handleClose = () => {
        useFileViewerStore.setState({
            close: false,
        });
    };

    return (
        <Dialog
            fullScreen
            open={close}
            onClose={handleClose}
            fullWidth={true}
            PaperProps={{
                style: {borderRadius: 15}
            }}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CancelIcon/>
                    </IconButton>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{width: "100%"}}>
                        <Button variant="outlined" color="inherit" disabled={fileDownloading}
                                startIcon={<FileDownloadIcon/>} onClick={() => {
                            handleDownload(file)
                        }}>
                            Download
                        </Button>
                        {file?.split('.').pop() !== 'pdf' ? <><IconButton color="inherit"><Link to={file}
                                                                                                target="_blank"
                                                                                                style={{color: "white"}}><FullscreenIcon/></Link></IconButton>
                            <IconButton color="inherit" onClick={() => {
                                if (zoom < 2.0)
                                    useFileViewerStore.setState({...useFileViewerStore, zoom: zoom + 0.2})
                            }}>
                                <ZoomInIcon/>
                            </IconButton>
                            <IconButton color="inherit" onClick={() => {
                                if (zoom > 1.0)
                                    useFileViewerStore.setState({...useFileViewerStore, zoom: zoom - 0.2})
                            }}>
                                <ZoomOutIcon/>
                            </IconButton>
                        </> : null}
                    </Stack>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {file && file.split('.').pop() === 'pdf' ?
                    <iframe src={`https://docs.google.com/viewer?url=${file}&embedded=true`}
                            style={{width: "100%", height: "100%"}} frameBorder="0"></iframe> :
                    <img
                        style={{maxHeight: "100%", maxWidth: "100%", transformOrigin: 'top left', transform: `scale(${zoom})`}}
                        src={file}
                        alt=""
                    />
                }
            </DialogContent>
        </Dialog>
    );
}

export default FileViewer;