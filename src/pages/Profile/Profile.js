import { Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { layFullInfoNguoiDungAction, layThongTinNguoiDungAction } from '../../redux/actions/QuanLyNguoiDungAction';





export default function (props) {

    function callback(key) {
        console.log(key);
    }
    const { TabPane } = Tabs;
    return <div className="p-5">
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="01. Chọn ghế và thanh toán" key="1">
                <Profile {...props} />
            </TabPane>
            <TabPane tab="02. Lịch sử đặt vé" key="2">
                <KetQuaDatVe {...props} />
            </TabPane>
        </Tabs>
    </div>

}


function Profile(props) {

    const { userLogin } = useSelector(state => state.QuanLyNguoiDungReducer);

    const dispatch = useDispatch();

    useEffect(async () => {
        const info = userLogin.taiKhoan;
        await dispatch(layFullInfoNguoiDungAction(info));
    }, [])

    const { fullInfoNguoiDung } = useSelector(state => state.QuanLyNguoiDungReducer);


    return (
        <div className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="mt-16 lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                    <img style={{ borderRadius: '50%' }} className="object-cover object-center" alt="hero" src="https://picsum.photos/300/300" />
                </div>
                <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                        Thông tin tài khoản
                    </h1>

                    <p className=" text-xl mb-8 leading-relaxed">Tài khoản : <span className="text-blue-500 text-4xl">{userLogin?.taiKhoan}</span></p>
                    <p className="text-xl mb-8 leading-relaxed">Email : <span className="text-blue-500 text-4xl">{userLogin?.email}</span></p>
                    <p className="text-xl mb-8 leading-relaxed">Họ tên : <span className="text-blue-500 text-4xl">{userLogin?.hoTen}</span></p>
                    <p className="text-xl mb-8 leading-relaxed">Số điện thoại : <span className="text-blue-500 text-4xl">{userLogin?.soDT}</span></p>
                    <div className="flex justify-center">
                        <NavLink to={`/profile/edit/${fullInfoNguoiDung.taiKhoan}`} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            Chỉnh sửa thông tin
                        </NavLink>
                        <NavLink to={`/`} className="ml-10 inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            Về trang chủ
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>

    )
}




function KetQuaDatVe(props) {
    const dispatch = useDispatch();

    const { userLogin } = useSelector(state => state.QuanLyNguoiDungReducer);

    useEffect(() => {
        const action = layThongTinNguoiDungAction();
        dispatch(action);
    }, [])

    const { thongTinNguoiDung } = useSelector(state => state.QuanLyNguoiDungReducer);
    const renderTicketItem = () => {

        console.log(thongTinNguoiDung, 'thongTinNguoiDung');
        return thongTinNguoiDung.thongTinDatVe?.map((ticket, index) => {
            const seats = _.first(ticket.danhSachGhe);
            return <div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex border-gray-200 border p-4 rounded-lg">
                    <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={ticket.hinhAnh} />
                    <div className="flex-grow">
                        <h2 className="text-gray-900 title-font font-extrabold text-xl">{ticket.tenPhim}</h2>
                        <p className="text-red-500 font-bold">{moment(ticket.ngayDat).format('hh:mm A - DD - MM - YYYY')}</p>
                        <p className="text-red-500 font-bold">Địa điểm : {seats.tenHeThongRap} - {seats.tenCumRap}</p>
                        {ticket.danhSachGhe.map((ghe, index) => {
                            return <div className="grid grid-cols-2">
                                Ghế bạn đặt : {ghe.tenGhe}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        })
    }

    return <div className="p-5">
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 text-red-500">Lịch sử đặt vé của {userLogin.hoTen}</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Mời bạn kiểm tra lại thông tin</p>
                </div>
                <div className="flex flex-wrap -m-2">
                    {renderTicketItem()}








                </div>
            </div>
        </section>

    </div>
}