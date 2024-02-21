import React, {useEffect, useState} from "react";
import {DeleteFilled, DeleteOutlined, UploadOutlined, FileWordFilled} from '@ant-design/icons';
import {Button, message, Modal, Upload} from 'antd';

const UploadFileComponent = (props) => {
    const {set_file_list_parent, random_string} = props;
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

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
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({fileList: newFileList}) => setFileList(newFileList);


    const props_upload = {
            onRemove: (file) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
            },
            beforeUpload: (file) => {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    message.error('File must smaller than 10MB!');
                    return Upload.LIST_IGNORE;
                } else if (file.name.match(/\s/g)) {
                    message.error('File name không được có khoảng trống');
                    return Upload.LIST_IGNORE;
                } else {
                    setFileList([...fileList, file]);
                }
                return false;
            },
            defaultFileList: fileList,
            showUploadList: {
                showPreviewIcon: true,
                showDownloadIcon: true,
                downloadIcon: 'Download',
                showRemoveIcon: true,
                previewIcon: <DeleteFilled onClick={(e) => console.log(e, 'custom removeIcon event')}/>,
                removeIcon: <DeleteFilled onClick={(e) => console.log(e, 'custom removeIcon event')}/>,
            },
            listType: 'picture',
            onPreview: handlePreview,
            // iconRender: (file, listType) => {
            //     // return <FileWordFilled />
            // }
        }
    ;

    useEffect(() => {
        set_file_list_parent({
            ...fileList,
            ['attachedString']: random_string,
            ['hasFile']: fileList.length > 0
        });

    }, [fileList]);


    return (
        <div style={{padding: 5}}>
            <Upload multiple={false} {...props_upload}>
                <Button icon={<UploadOutlined/>}>Chọn file</Button>
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
};
export default UploadFileComponent;