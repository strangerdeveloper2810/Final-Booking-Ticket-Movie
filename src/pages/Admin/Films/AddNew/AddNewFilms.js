import React, { useState } from 'react';
import {
    Form,
    Input,
    Radio,
    DatePicker,
    InputNumber,
    Switch,
} from 'antd';
import { useFormik } from 'formik';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { themPhimUploadHinhAction } from '../../../../redux/actions/QuanLyPhimActions';
import { GROUPID } from '../../../../util/settings/config';

const AddNewFilm = () => {
    const [componentSize, setComponentSize] = useState('default');


    const [imgSrc, setImgSrc] = useState(null);
    const dispatch = useDispatch();


    const formik = useFormik({
        initialValues: {
            tenPhim: '',
            trailer: '',
            moTa: '',
            ngayKhoiChieu: '',
            dangChieu: false,
            sapChieu: false,
            hot: false,
            danhGia: 0,
            hinhAnh: {},
            maNhom: GROUPID,
        },
        onSubmit: (values) => {
            console.log({ values })

            //! Tạo đối tượng để action
            let formData = new FormData();
            // formData.append('tenPhim', formik.values.tenPhim)
            // Vòng lặp chạy Submit Form
            for (let key in values) {

                if (key !== ' hinhAnh') {
                    formData.append(key, values[key]);
                }
                else {
                    formData.append('File', values.hinhAnh, values.hinhAnh.name);
                }
            }
            //Gọi API
            dispatch(themPhimUploadHinhAction(formData));
        }
    })

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };


    const handleChangeDatePicker = (values) => {
        const ngayKhoiChieu = moment(values).format("DD/MM/YYYY")

        //! Fill vào Date Time
        formik.setFieldValue('ngayKhoiChieu', ngayKhoiChieu)
    }

    // CLOSURE FUNCTION
    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value);
        }
    }

    const handleChangeFile = (event) => {
        //Lấy file từ event
        let file = event.target.files[0];

        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png'
        ) {
            //Đọc file preview hình ảnh
            let reader = new FileReader();
            //Syntax đọc thẻ img
            reader.readAsDataURL(file);

            reader.onload = (e) => {
                setImgSrc(e.target.result);
            }
        }

        //Đem dữ liệu lưu vào formik
        formik.setFieldValue('hinhAnh', file);
    }


    return (
        <>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: componentSize,
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
            >
                <h3>Thêm Mới Phim</h3>
                <Form.Item label="Form Size" name="size">
                    <Radio.Group>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {/* Tên Phim */}
                <Form.Item label="Tên Phim">
                    <Input name="tenPhim" onChange={formik.handleChange} />
                </Form.Item>

                {/* Trailer */}
                <Form.Item label="Trailer">
                    <Input name="trailer" onChange={formik.handleChange} />
                </Form.Item>

                {/* Mô tả */}
                <Form.Item label="Mô tả">
                    <Input name="moTa" onChange={formik.handleChange} />
                </Form.Item>

                {/* Ngày khởi chiếu */}
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker format={"DD/MM/YYYY"} onChange={handleChangeDatePicker} />
                </Form.Item>

                {/* Đang chiếu */}
                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch name="dangChieu" onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>

                {/* Sắp chiếu */}
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch name="sapChieu" onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>

                {/* Hot ? True False */}
                <Form.Item label="Hot" valuePropName="checked">
                    <Switch name="hot" onChange={handleChangeSwitch('hot')} />
                </Form.Item>


                {/* Rating */}
                <Form.Item label="Đánh giá số sao">
                    <InputNumber min={1} max={10} onChange={handleChangeSwitch('danhGia')} />
                </Form.Item>

                {/* Upload Image */}
                <Form.Item className="mb-5" label="Hình ảnh">
                    <input
                        accept="image/png, image/jpeg, image/gif, image/png"
                        type="file" onChange={handleChangeFile} />

                    {/*Để hình preview */}
                    {imgSrc !== null && <img className="mt-5" width={150} height={150} src={imgSrc} alt='...' />}
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button type="submit" className="bg-blue-300 text-white p-2">Thêm Phim</button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddNewFilm