import React, { useEffect, useState } from 'react'
import { Layout, Menu, Form, DatePicker, InputNumber, Select } from 'antd';
import axios from 'axios';
import { DOMAIN, TOKEN, TOKENCYBERSOFT } from '../../../util/settings/config';
import { useFormik } from 'formik';
import moment from 'moment';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Showtime(props) {

    const formik = useFormik({
        initialValues: {
            maPhim: props.match.params.id,
            ngayChieuGioChieu: '',
            maRap: '',
            giaVe: '',
        },

        onSubmit: async (values) => {
            try {
                const result = await axios({
                    url: `${DOMAIN}/api/QuanLyDatVe/TaoLichChieu`,
                    method: 'POST',
                    data: values,
                    headers: {
                        TokenCybersoft: TOKENCYBERSOFT,
                        Authorization: "Bearer " + localStorage.getItem(TOKEN),
                    }
                })
                alert('Tạo Lịch Chiếu Phim thành công')
                console.log(result);
            }
            catch (err) {
                console.log(err.response?.data)
            }
        }
       
    })


    const [state, setState] = useState({
        heThongRapChieu: [],
        cumRapChieu: [],
    })
    useEffect(async () => {
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyRap/LayThongTinHeThongRap`,
                method: 'GET',
                params: {
                    maNhom: 'GP01',
                },
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                }
            })

            setState({
                ...state,
                heThongRapChieu: result.data.content,
            })




        } catch (err) {
            console.log(err.response?.data);
        }
    }, [])


    const handleChangeHeThongRap = async (maCumRap) => {
        
        try {
            const result = await axios({
                url: `${DOMAIN}/api/QuanLyRap/LayThongTinCumRapTheoHeThong`,
                params: {
                    maHeThongRap: maCumRap,
                },
                method: 'GET',
                headers: {
                    TokenCybersoft: TOKENCYBERSOFT
                }
            })

            setState({
                ...state,
                cumRapChieu: result.data.content,
            })

        }
        catch (err) {
            console.log(err.response?.data);
        }
    }





    const onChangeInputNumber = (values) => {
        formik.setFieldValue('giaVe', values);
    }

    const convertSelectHeThongRap = () => {
        return state.heThongRapChieu?.map((htr, index) => {
            return {
                label: htr.tenHeThongRap,
                value: htr.maHeThongRap
            }
        })
    }

    const convertCumRapTheoHTR = () => {
        return state.cumRapChieu?.map((cumRap, index) => ({
            label: cumRap.tenCumRap,
            value: cumRap.maCumRap
        }))
    }

    const handleChangeCumRap = (values) => {
        formik.setFieldValue('maRap', values);
    }

    const onOk = (values) => {
        formik.setFieldValue('ngayChieuGioChieu', moment(values).format('DD/MM/YYYY hh:mm:ss'));
        console.log('values', moment(values).format('DD/MM/YYYY hh:mm:ss'))
    }

    const onChangeDate = (values) => {
        formik.setFieldValue('ngayChieuGioChieu', moment(values).format('DD/MM/YYYY hh:mm:ss'));
        console.log('values', moment(values).format('DD/MM/YYYY hh:mm:ss'))
    }

    let film = {}
    if (localStorage.getItem('filmParams')) {
        film = JSON.parse(localStorage.getItem('filmParams'));

    }

    return (
        <Form
            onSubmitCapture={formik.handleSubmit}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
        >
            <h3 className="text-2xl">Tạo lịch chiếu cho Phim - <span className="text-4xl text-red-500"> {props.match.params.tenphim}</span></h3>
            <img width={200} height={200} src={film.hinhAnh} alt={film.tenPhim} />
            <Form.Item label="Hệ thống rạp">
                <Select
                    options={convertSelectHeThongRap()}
                    onChange={handleChangeHeThongRap}
                    placeholder="Chọn hệ thống rạp" />
            </Form.Item>

            <Form.Item label="Cụm rạp">
                <Select options={convertCumRapTheoHTR()} onChange={handleChangeCumRap} placeholder="Chọn cụm rạp" />
            </Form.Item>

            <Form.Item label="Ngày chiếu giờ chiếu">
                <DatePicker format="DD/MM/YYYY hh:mm:ss" showTime onChange={onChangeDate} onOk={onOk} />
            </Form.Item>

            <Form.Item label="Giá vé">
                <InputNumber min={0} onChange={onChangeInputNumber} />
            </Form.Item>
            <Form.Item label="Chức năng">
                <button type="submit" className="bg-blue-300 text-white p-2">Tạo lịch chiếu</button>
            </Form.Item>
        </Form>
    )
}

export default Showtime
