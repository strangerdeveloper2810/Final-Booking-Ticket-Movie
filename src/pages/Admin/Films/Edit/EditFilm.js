import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { capNhatPhimAction, layThongTinPhimChinhSuaAction } from '../../../../redux/actions/QuanLyPhimActions';
import { GROUPID } from '../../../../util/settings/config';

const EditFilm = (props) => {
    const [componentSize, setComponentSize] = useState('default');

    // Để rỗng để lấy được hình cũ
    const [imgSrc, setImgSrc] = useState('');
    const dispatch = useDispatch();

    //Lấy thông Tin Phim Chỉnh sửa
    useEffect(() => {
        let { id } = props.match.params;
        dispatch(layThongTinPhimChinhSuaAction(id));

    }, [])

    const { thongTinPhimChinhSua } = useSelector(state => state.QuanLyPhimReducer);
    console.log({ thongTinPhimChinhSua });

    const formik = useFormik({
        // Edit enable của Formik
        enableReinitialize: true,
        initialValues: {
            maPhim: thongTinPhimChinhSua?.maPhim,
            tenPhim: thongTinPhimChinhSua?.tenPhim,
            trailer: thongTinPhimChinhSua?.trailer,
            moTa: thongTinPhimChinhSua?.moTa,
            ngayKhoiChieu: thongTinPhimChinhSua?.ngayKhoiChieu,
            dangChieu: thongTinPhimChinhSua?.dangChieu,
            sapChieu: thongTinPhimChinhSua?.sapChieu,
            hot: thongTinPhimChinhSua?.hot,
            danhGia: thongTinPhimChinhSua?.danhGia,
            hinhAnh: null,
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
                    if (values.hinhAnh !== null) {
                        formData.append('File', values.hinhAnh, values.hinhAnh.name);
                    }
                }
            }
            //Gọi API
            dispatch(capNhatPhimAction(formData))
        }
    })

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };


    const handleChangeDatePicker = (value) => {
        let ngayKhoiChieu = moment(value)

        //! Fill vào Date Time
        formik.setFieldValue('ngayKhoiChieu', ngayKhoiChieu)
    }

    // CLOSURE FUNCTION
    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value);
        }

    }

    const handleChangeFile = async (event) => {
        //Lấy file từ event
        let file = event.target.files[0];

        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png'
        ) {
            //Đem dữ liệu lưu vào formik
            await formik.setFieldValue('hinhAnh', file);
            //Đọc file preview hình ảnh
            let reader = new FileReader();
            //Syntax đọc thẻ img
            reader.readAsDataURL(file);

            // Side Effect Bất đồng bộ
            reader.onload = (e) => {
                setImgSrc(e.target.result);
            }
        }


    }
    const dateFormat = 'DD/MM/YYYY';

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
                <h3>Edit Phim</h3>
                <Form.Item label="Form Size" name="size">
                    <Radio.Group>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {/* Tên Phim */}
                <Form.Item label="Tên Phim">
                    <Input name="tenPhim" value={formik.values.tenPhim} onChange={formik.handleChange} />
                </Form.Item>

                {/* Trailer */}
                <Form.Item label="Trailer">
                    <Input name="trailer" value={formik.values.trailer} onChange={formik.handleChange} />
                </Form.Item>

                {/* Mô tả */}
                <Form.Item label="Mô tả">
                    <Input name="moTa" value={formik.values.moTa} onChange={formik.handleChange} />
                </Form.Item>

                {/* Ngày khởi chiếu */}
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker
                        allowClear={false}

                        // name="ngayKhoiChieu"
                        onChange={handleChangeDatePicker}
                        // format={dateFormat}
                        format='DD/MM/YYYY'
                        value={moment(formik.values.ngayKhoiChieu)}

                    // defaultValue={moment(formik.values.ngayKhoiChieu, dateFormat)}

                    />
                </Form.Item>

                {/* Đang chiếu */}
                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch checked={formik.values.dangChieu} name="dangChieu" onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>

                {/* Sắp chiếu */}
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch checked={formik.values.sapChieu} name="sapChieu" onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>

                {/* Hot ? True False */}
                <Form.Item label="Hot" valuePropName="checked">
                    <Switch checked={formik.values.hot} name="hot" onChange={handleChangeSwitch('hot')} />
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
                    <img className="mt-5" width={150} height={150} src={imgSrc === '' ? thongTinPhimChinhSua.hinhAnh : imgSrc} alt='...' />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button type="submit" className="bg-blue-300 text-white p-2">Cập nhật</button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditFilm