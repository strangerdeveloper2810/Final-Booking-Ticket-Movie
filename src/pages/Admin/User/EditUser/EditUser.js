import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Radio,
    Select
} from 'antd';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { DOMAIN, GROUPID, TOKENCYBERSOFT } from '../../../../util/settings/config';
import { capNhatNguoiDungAction, layFullInfoNguoiDungAction } from '../../../../redux/actions/QuanLyNguoiDungAction';
import axios from 'axios';

const EditUser = (props) => {
    const [componentSize, setComponentSize] = useState('default');

    const dispatch = useDispatch();



    useEffect(async () => {
        let { taiKhoan } = props.match.params;
        await dispatch(layFullInfoNguoiDungAction(taiKhoan))
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung`,
                method: 'GET',
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT,
                }
            })
            setState({
                maLoaiNguoiDung: result.data.content
            });
        }
        catch (err) {
            console.log(err.response?.data);
        }

    }, [])

    const { fullInfoNguoiDung } = useSelector(state => state.QuanLyNguoiDungReducer);

    const formik = useFormik({
        // Edit enable của Formik
        enableReinitialize: true,
        initialValues: {
            taiKhoan: fullInfoNguoiDung.taiKhoan,
            matKhau: fullInfoNguoiDung.matKhau,
            email: fullInfoNguoiDung.email,
            soDT: fullInfoNguoiDung.soDT,
            maNhom: GROUPID,
            maLoaiNguoiDung: fullInfoNguoiDung.maLoaiNguoiDung,
            hoTen: fullInfoNguoiDung.hoTen,
        },
        onSubmit: (values) => {
            console.log({ values })
            dispatch(capNhatNguoiDungAction(values));
            //Gọi API

        }
    })

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const [state, setState] = useState({
        maLoaiNguoiDung: [],
    })


    const convertChangeSelect = (values) => {
        return state.maLoaiNguoiDung.map((maLoai, index) => {
            return {
                label: maLoai.tenLoai,
                value: maLoai.maLoaiNguoiDung,
            }
        })
    }

    const handleChangeSelect = (values) => {
        console.log(values);
        formik.setFieldValue('maLoaiNguoiDung', values);
    }


    const handleChangeNumber = (values) => {
        formik.setFieldValue('soDT', values);
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
                <h3>Edit User</h3>
                <Form.Item label="Form Size" name="size">
                    <Radio.Group>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {/* Tên TK */}
                <Form.Item label="Tên Tài Khoản">
                    <Input value={formik.values.taiKhoan} name="taiKhoan" onChange={formik.handleChange} />
                </Form.Item>

                {/* Mật Khẩu */}
                <Form.Item label="Mật Khẩu">
                    <Input value={formik.values.matKhau} name="matKhau" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Họ và Tên">
                    <Input value={formik.values.hoTen} name="hoTen" onChange={formik.handleChange} />
                </Form.Item>

                {/* Email */}
                <Form.Item label="Email">
                    <Input value={formik.values.email} name="email" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Số Điện Thoại">
                    <Input type="number" value={formik.values.soDT} name="soDT" onChange={formik.handleChange} />
                </Form.Item>


                <Form.Item label="Loại Người Dùng">
                    <Select value={formik.values.maLoaiNguoiDung} options={convertChangeSelect()} onChange={handleChangeSelect} placeholder="Chọn loại người dùng" />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button type="submit" className="bg-blue-300 text-white p-2">Cập Nhật</button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditUser