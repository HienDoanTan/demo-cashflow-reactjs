import {
    UploadOutlined,
    VideoCameraOutlined,
    StarOutlined,
    DeleteFilled,
    FileExcelFilled,
    FileExcelOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {Player} from "video-react";
import {Button, Upload, Checkbox, Modal, message} from 'antd';
import React, {useEffect, useState} from "react";
import 'video-react/dist/video-react.css'; // import css
import {colorOptions} from "../config/colors_config.json";
import {getExtension} from "./helpers";


const UploadDefaultFileComponent = (props) => {
    const {attached_group, set_file_list_parent, attachedString, type, isEditing, id_value} = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [videoSrc, seVideoSrc] = useState('');
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        const extension = getExtension(file.name);
        switch (extension) {
            case 'jpg':
            case 'png':
            case 'gif':
            case 'svg':
                setPreviewImage(file.url || file.preview);
                seVideoSrc('');
                break;
            case 'csv':
            case 'xlsx':
                /* handle */
                break;
            case 'mp4':
                setPreviewImage('');
                seVideoSrc(file.url);
                break;
            default:
                /* handle */
                break;
        }

        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };


    const props_upload = {
        onRemove: (file) => {

            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);

            set_file_list_parent(newFileList);

        },
        beforeUpload: (file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                messageApi.error('File must smaller than 2MB!');
                return Upload.LIST_IGNORE;
            } else if (file.name.match(/\s/g)) {
                messageApi.error('File name không được có khoảng trống');
                return Upload.LIST_IGNORE;
            } else {
                setFileList([...fileList, file]);

                if (isEditing !== '' && id_value === isEditing) {
                    if (attachedString) {
                        if (fileList.length > 0) {
                            set_file_list_parent([...fileList, file]);
                        }
                    }
                }
            }
            return false;
        },
        defaultFileList: attached_group,
        showUploadList: {
            showDownloadIcon: true,
            downloadIcon: 'Download',
            showRemoveIcon: isEditing !== '' && id_value === isEditing,
            removeIcon: <DeleteFilled/>,
        },
        listType: 'picture', //picture
        onPreview: handlePreview,
        iconRender: (file, listType) => {
            const extension = getExtension(file.name);
            switch (extension) {
                case 'jpg':
                case 'png':
                case 'gif':
                    /* handle */
                    break;
                case 'csv':
                case 'xlsx':
                    return <FileExcelFilled/>;
                    break;
                case 'mp4':
                    return <VideoCameraOutlined/>;
                    break;
                default:
                    /* handle */
                    break;
            }
        }
    };

    return (
        <div>
            {contextHolder}
            <Upload {...props_upload}>
                {isEditing !== '' && id_value === isEditing && (
                    <Button type={"default"}
                            style={{margin: 5}}
                            icon={<UploadOutlined/>}>Upload</Button>
                )}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
                {videoSrc !== '' && (
                    <Player
                        playsInline
                        src={videoSrc}
                        fluid={false}
                        style={{
                            width: '100%',
                            maxHeight: 300
                        }}
                    />
                )}
            </Modal>
        </div>
    )
};
export default UploadDefaultFileComponent;