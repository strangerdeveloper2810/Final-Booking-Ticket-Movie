import React, { Fragment, useEffect } from 'react'
import { Table } from 'antd';
import { Input } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { history } from '../../../App';
import { layDanhSachListNguoiDungAction, xoaNguoiDungAction } from '../../../redux/actions/QuanLyNguoiDungAction';
function Users() {

    const { danhSachNguoiDung } = useSelector(state => state.QuanLyNguoiDungReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(layDanhSachListNguoiDungAction());
    }, [])


    const columns = [
        {
            title: 'Tài Khoản',
            dataIndex: 'taiKhoan',
            width: 50,
            sorter: (a, b) => {
                let taiKhoanA = a.taiKhoan.toLowerCase().trim();
                let taiKhoanB = b.taiKhoan.toLowerCase().trim();
                if (taiKhoanA > taiKhoanB) {
                    return 1;
                }
                return -1;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Mật Khẩu',
            dataIndex: 'matKhau',
            width: 50,
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'hoTen',
            width: 50,
            sorter: (a, b) => {
                let hoTenA = a.hoTen.toLowerCase().trim();
                let hoTenB = b.hoTen.toLowerCase().trim();
                if (hoTenA > hoTenB) {
                    return 1;
                }
                return -1;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 50,
            sorter: (a, b) => {
                let emailA = a.email.toLowerCase().trim();
                let emailB = b.email.toLowerCase().trim();
                if (emailA > emailB) {
                    return 1;
                }
                return -1;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'soDt',
            width: 10,
        },
        {
            title: 'Hành Động',
            dataIndex: 'hanhDong',
            width: 100,
            render: (text, user, index) => {
                return <Fragment key={index}>
                    <NavLink key={1} style={{ color: 'blue' }} to={`/admin/users/edit/${user.taiKhoan}`} className="text-black text-2xl mr-2"><EditOutlined /></NavLink>
                    <span onClick={() => {
                        if (window.confirm('Bạn có muốn chắc xoá user này' + user.taiKhoan)) {
                            //action
                            dispatch(xoaNguoiDungAction(user.taiKhoan));
                        }
                    }} key={2} style={{ color: 'red', cursor: 'pointer' }} className="text-white text-2xl mr-2"><DeleteOutlined /></span>

                </Fragment>
            }
        },
        {
            title: 'Loại Người Dùng',
            dataIndex: 'maLoaiNguoiDung',
            width: 100,
            sorter: (a, b) => {
                let maLoaiNguoiDungA = a.maLoaiNguoiDung.toLowerCase().trim();
                let maLoaiNguoiDungB = b.maLoaiNguoiDung.toLowerCase().trim();
                if (maLoaiNguoiDungA > maLoaiNguoiDungB) {
                    return 1;
                }
                return -1;
            },
            sortDirections: ['descend', 'ascend'],
        },
    ];
    const data = danhSachNguoiDung;
    function onChange(pagination, filters, sorter, extra) {

    }
    const { Search } = Input;


    const onSearch = tuKhoa => {
        console.log(tuKhoa);
        // //API
        dispatch(layDanhSachListNguoiDungAction(tuKhoa));
    };
    return (
        <div>

            <h3 className="text-4xl">Quản lý User</h3>
            <Button type="primary" danger onClick={() => {
                history.push('/admin/users/addnew');
            }} className="mb-5">Thêm User</Button>
            <Search
                className="mb-5"
                placeholder="Tìm kiếm user"
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={onSearch}
            />
            <Table rowKey={"taiKhoan"} columns={columns} dataSource={data} onChange={onChange} />
        </div>
    )
}

export default Users