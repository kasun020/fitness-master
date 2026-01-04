import React, {useEffect, useRef} from "react";
import {
    FileUploadContainer,
    FormField,
    DragDropText,
    UploadFileBtn,
    FilePreviewContainer,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    FileMetaData,
    RemoveFileIcon,
    VideoPreview,
} from "./file-upload.styles";
import {useField, useFormikContext} from "formik";
import {Badge, Box, Typography} from "@mui/material";
import ImageCropper, {
    closeImageCropper,
    openImageCropper,
} from "./imageCropper";
import {_setImage} from "../../../utils";
import {IMAGE_SIZE} from "../../../../store/constants";
import CropIcon from "@mui/icons-material/Crop";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import {useTheme} from "@mui/material/styles";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = IMAGE_SIZE;

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const FileUpload = ({
                        label,
                        name,
                        limit,
                        maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
                        customHandleChange,
                        ...otherProps
                    }) => {
    const theme = useTheme();
    const fileInputField = useRef(null);
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(name);

    // console.log(
    //   "## ",
    //   field?.value.length > 0
    //     ? field.value[0].type === "application/vnd.ms-excel"
    //       ? "text/csv"
    //       : field.value[0].type
    //     : ""
    // );

    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };

    const addNewFiles = (newFiles) => {
        let totalFileSize = field.value?.reduce((accumulator, curValue) => {
            return accumulator + curValue.size;
        }, 0);

        for (let file of newFiles) {
            totalFileSize += file.size;
            if (totalFileSize <= maxFileSizeInBytes) {
                if (!otherProps.multiple) {
                    return [file];
                }
                field.value = [...field.value, file];
            }
        }

        return [...field.value];
    };

    useEffect(() => {
        if (field.value && typeof field.value.name === "string") {
            let updatedFiles = addNewFiles([field.value]);
            setFieldValue(name, updatedFiles);
        }
        customHandleChange(field.value);
    }, [field.value]);

    const handleNewFileUpload = (e) => {
        const {files: newFiles} = e.target;
        if (newFiles.length) {
            let updatedFiles = addNewFiles(newFiles);
            setFieldValue(name, updatedFiles);
        }
    };

    const removeFile = (fileIndex) => {
        field.value.splice(fileIndex, 1);
        setFieldValue(name, field.value);
        customHandleChange(field.value);
    };

    // Generating Cropped Image When Done Button Clicked
    const onCropDone = (imgCroppedArea, image, fileName) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            const dataURL = canvasEle.toDataURL();

            _setImage(dataURL, fileName).then((value) => {
                let updatedField = field.value.map((obj) =>
                    obj.name === fileName ? value : obj
                );
                setFieldValue(name, updatedField);
                closeImageCropper();
            });
        };
    };

    // Handle Cancel Button Click
    const onCropCancel = () => {
    };

    return (
        <>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <Typography variant="body2" color={meta.error ? 'error' : 'textSecondary'}>
                        {label}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FileUploadContainer error={meta.error} theme={theme}>
                        <DragDropText error={meta.error} theme={theme}>Drag and drop your files anywhere
                            or</DragDropText>
                        <UploadFileBtn
                            type="button"
                            onClick={handleUploadBtnClick}
                            disabled={otherProps.disabled}
                        >
                            <FileUploadIcon sx={{fontSize: "20px"}}/>
                            &nbsp;
                            <Typography variant="button">
                                {" "}
                                Upload {otherProps.multiple ? "files" : "a file"}
                            </Typography>
                        </UploadFileBtn>
                        <FormField
                            type="file"
                            ref={fileInputField}
                            onChange={handleNewFileUpload}
                            title=""
                            value=""
                            {...otherProps}
                        />
                        <DragDropText error={meta.error} theme={theme}>File upload limit: {limit}.</DragDropText>
                    </FileUploadContainer>
                </Grid>
                <Grid item xs={12}>
                    <FilePreviewContainer>
                        {/* <span>To Upload</span> */}
                        <PreviewList>
                            {field.value?.map((file, index) => {
                                // console.log(file);
                                let isExcelFile =
                                    file?.type.split("/")[1].split(".")[0] === "vnd";
                                let isCsvFile = file?.type.split("/")[1] === "csv";
                                let isPdfFile = file?.type.split("/")[1] === "pdf";
                                let isImageFile = file?.type?.split("/")[0] === "image";
                                let isVideoFile = file?.type?.split("/")[0] === "video";
                                return (
                                    otherProps?.disabled || (
                                        <Box key={file.name} sx={{marginTop: 1}}>
                                            {URL.createObjectURL(file) && (
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                    badgeContent={
                                                        <CancelIcon onClick={() => removeFile(index)}/>
                                                    }
                                                    sx={{
                                                        cursor: "pointer",
                                                        color: theme.palette.primary.main,
                                                        display: "flex",
                                                    }}
                                                />
                                            )}
                                            <PreviewContainer>
                                                <Box>
                                                    {isExcelFile && (
                                                        <ImagePreview
                                                            src="https://dsuabgmmtxmj1.cloudfront.net/common/excel_icon2.png"
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isCsvFile && (
                                                        <ImagePreview
                                                            src="https://cdn-icons-png.flaticon.com/128/8242/8242984.png"
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isPdfFile && (
                                                        <ImagePreview
                                                            src="https://dsuabgmmtxmj1.cloudfront.net/common/pdf_file_icon.png"
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isImageFile && (
                                                        <ImagePreview
                                                            src={URL.createObjectURL(file)}
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isVideoFile && (
                                                        <VideoPreview
                                                            alt={`file preview ${index}`}
                                                            autoPlay
                                                            muted
                                                        >
                                                            <source
                                                                src={URL.createObjectURL(file)}
                                                                type={file?.type}
                                                            ></source>
                                                        </VideoPreview>
                                                    )}
                                                    <FileMetaData
                                                        display={
                                                            isPdfFile ||
                                                            isCsvFile ||
                                                            isExcelFile ||
                                                            isImageFile ||
                                                            isVideoFile
                                                                ? "none"
                                                                : "flex"
                                                        }
                                                    >
                                                        <Typography
                                                            width={100}
                                                            color="white"
                                                            variant="subtitle2"
                                                            style={{
                                                                wordWrap: "break-word",
                                                                fontWeight: "bold",
                                                                color: 'white'
                                                            }}
                                                        >
                                                            {file.name.substring(0, 30) +
                                                                (file.name.length > 30 ? "..." : "")}
                                                        </Typography>
                                                        <aside>
                                                            <Typography
                                                                width={100}
                                                                variant="subtitle2"
                                                                style={{
                                                                    color: 'white'
                                                                }}
                                                            >
                                                                {convertBytesToKB(file.size)} kb
                                                            </Typography>
                                                            <aside>
                                                                {/*<RemoveFileIcon*/}
                                                                {/*    color='secondary'*/}
                                                                {/*    size='small'*/}
                                                                {/*    onClick={() => removeFile(fileName)}*/}
                                                                {/*><DeleteIcon/></RemoveFileIcon>*/}
                                                                {isImageFile && (
                                                                    <RemoveFileIcon
                                                                        color="inherit"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            openImageCropper(
                                                                                URL.createObjectURL(file),
                                                                                file.name,
                                                                                onCropDone,
                                                                                onCropCancel
                                                                            );
                                                                        }}
                                                                    >
                                                                        <CropIcon/>
                                                                    </RemoveFileIcon>
                                                                )}
                                                            </aside>
                                                        </aside>
                                                    </FileMetaData>
                                                </Box>
                                            </PreviewContainer>
                                            <Grid item xs={12}>
                                                <Typography
                                                    width={130}
                                                    color="gray"
                                                    variant="subtitle2"
                                                    style={{
                                                        wordWrap: "break-word",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {field.value?.map((file) => {
                                                        return (
                                                            file.name.substring(0, 30) +
                                                            (file.name.length > 30 ? "..." : "")
                                                        );
                                                    })}
                                                </Typography>
                                            </Grid>
                                        </Box>
                                    )
                                );
                            })}
                        </PreviewList>
                    </FilePreviewContainer>
                </Grid>
                <Grid item xs={12}>
                    {meta && meta.error ? (
                        <Typography variant="caption" color="error">
                            {meta.error}
                        </Typography>
                    ) : null}
                </Grid>
            </Grid>
            <ImageCropper/>
        </>
    );
};
export default FileUpload;
