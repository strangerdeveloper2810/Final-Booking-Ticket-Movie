import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Radio,
    Select
} from 'antd';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { DOMAIN, GROUPID, TOKEN, TOKENCYBERSOFT } from '../../../../util/settings/config';
import axios from 'axios';
import { history } from '../../../../App';
import { layDanhSachListNguoiDungAction } from '../../../../redux/actions/QuanLyNguoiDungAction';

const AddUser = () => {
    const [componentSize, setComponentSize] = useState('default');

    useEffect(async () => {
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

    const [state, setState] = useState({
        maLoaiNguoiDung: [],
    })

    console.log(state.maLoaiNguoiDung)
    const dispatch = useDispatch();

    const { Option } = Select;

    function handleChange(values) {
        formik.setFieldValue(values);
    }

    const formik = useFormik({
        initialValues: {
            taiKhoan: "",
            matKhau: "",
            email: "",
            soDT: '',
            maNhom: GROUPID,
            maLoaiNguoiDung: '',
            hoTen: '',
        },
        onSubmit: async (values) => {
            console.log({ values })

            //Gọi API
            try {
                const result = await axios({
                    url: `${DOMAIN}/api/QuanLyNguoiDung/ThemNguoiDung`,
                    method: 'POST',
                    data: values,
                    headers: {
                        TokenCybersoft: TOKENCYBERSOFT,
                        Authorization: "Bearer " + localStorage.getItem(TOKEN),
                    }
                })
                if (result.data.statusCode === 200) {
                    alert('Thêm mới user thành công');
                    dispatch(layDanhSachListNguoiDungAction());
                    history.push('/admin/users')
                }
                console.log(result);
            }
            catch (err) {
                console.log(err.response?.data);
            }
        }
    })

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

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
                <h3>Thêm Mới User</h3>
                <Form.Item label="Form Size" name="size">
                    <Radio.Group>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {/* Tên TK */}
                <Form.Item label="Tên Tài Khoản">
                    <Input name="taiKhoan" onChange={formik.handleChange} />
                </Form.Item>

                {/* Mật Khẩu */}
                <Form.Item label="Mật Khẩu">
                    <Input name="matKhau" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Họ và Tên">
                    <Input name="hoTen" onChange={formik.handleChange} />
                </Form.Item>

                {/* Email */}
                <Form.Item label="Email">
                    <Input name="email" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Số Điện Thoại">
                    <Input type="number" value={formik.values.soDT} name="soDT" onChange={formik.handleChange} />
                </Form.Item>


                <Form.Item label="Loại Người Dùng">
                    <Select options={convertChangeSelect()} onChange={handleChangeSelect} placeholder="Chọn loại người dùng" />
                </Form.Item>


                <Form.Item label="Tác vụ">
                    <button type="submit" className="bg-blue-300 text-white p-2">Thêm User</button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddUser