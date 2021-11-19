import React, { useEffect } from 'react'
import { CustomCard } from '@tsamantanis/react-glassmorphism'
import '@tsamantanis/react-glassmorphism/dist/index.css'
import '../../assets/styles/circle.scss';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { layThongTinChiTietFilmAction, layThongTinLichChieuTheoFilmAction } from '../../redux/actions/QuanLyPhimActions';
import moment from 'moment';
import { Rate } from 'antd';
import { NavLink } from 'react-router-dom';
const { TabPane } = Tabs;


function Detail(props) {


  const filmDetail = useSelector(state => state.QuanLyPhimReducer.filmDetail);
  // console.log(filmDetail)


  const filmSchedule = useSelector(state => state.QuanLyPhimReducer.filmSchedule);
  const dispatch = useDispatch();
  console.log({ filmSchedule })


  useEffect(() => {
    // GET ID URL DETAIL PAGE
    let { id } = props.match.params;

    dispatch(layThongTinChiTietFilmAction(id));
    dispatch(layThongTinLichChieuTheoFilmAction(id));
  }, [])

  return (
    <div style={{
      backgroundImage: `url(${filmDetail.hinhAnh})`,
      minHeight: '100vh',
      backgroundSize: '100%',
      backgroundPosition: 'center',
    }}>
      <CustomCard
        style={{ paddingTop: 150, minHeight: '100vh' }}
        effectColor="#C780FF" // required
        color="#14AEFF" // default color is white
        blur={20} // default blur value is 10px
        borderRadius={0} // default border radius value is 10px
      >
        <div className="grid grid-cols-12">
          <div className="col-span-5 col-start-3">
            <div className="grid grid-cols-3">
              <img
                className="col-span-1"
                style={{ width: '100%', height: 300 }}
                src={filmDetail.hinhAnh} alt="123" />
              <div
                style={{ marginTop: '25%' }}
                className="col-span-2 ml-5">
                <p className="text-sm text-red-500 font-bold">Ngày Chiếu : {moment(filmDetail.ngayKhoiChieu).format('DD - MM - YYYY')}</p>
                <p className="text-2xl leading-3 text-red-500 font-bold">{filmDetail.tenPhim}</p>
                <p className="text-sm text-red-500 font-bold ">{filmDetail.moTa}</p>
              </div>
            </div>
          </div>
          <div className="col-span-4 ml-16">
            <h1 className="ml-16 text-red-600 font-bold text-2xl">Đánh giá</h1>
            <h1 className="ml-12"><Rate allowHalf defaultValue={filmDetail.danhGia / 2} /></h1>
            <h1 className={`c100 p${filmDetail.danhGia * 10} big orange`}>

              <span>{filmDetail.danhGia * 10}%</span>
              <div className="slice">
                <div className="bar" />
                <div className="fill" />
              </div>
            </h1>

          </div>
        </div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Lịch chiếu" style={{ minHeight: 300 }} key="1">
            <div className="mt-20 container">
              <Tabs tabPosition={'left'}>
                {filmSchedule.heThongRapChieu?.map((htr, index) => {
                  return <TabPane key={index} tab={
                    <div className="flex items-center mt-5">
                      <img src={htr.logo} className="rounded-full ml-5 mr-5" height={50} width={50} alt={htr.logo} />
                      <p>{htr.tenHeThongRap}</p>
                    </div>
                  } >
                    {htr.cumRapChieu?.map((cumRap, index) => {
                      return <div key={index}>
                        <div className="flex flex-row">
                          <img style={{ width: 75, height: 75 }} src="https://tieudung.vn/upload_images/images/2021/06/03/rap-chieu-phim.jpg" />
                          <div className="ml-2 font-bold text-red-500">
                            <p className="text-xl ">{cumRap.tenCumRap}</p>
                            <p className="text-white">{cumRap.diaChi}</p>
                            <hr />
                          </div>
                        </div>
                        <div className="thong-tin-lich-chieu-phim grid grid-cols-4">
                          {cumRap.lichChieuPhim?.map((lichChieu, index) => {
                            return <NavLink to={`/checkout/${lichChieu.maLichChieu}`} className="col-span-1 text-green-300 font-bold" key={index}>
                              {moment(lichChieu.ngayChieuGioChieu).format('hh:mm A')}
                            </NavLink>
                          })}
                        </div>
                      </div>
                    })}
                  </TabPane>
                })}
              </Tabs>
            </div>
          </TabPane>
          <TabPane tab="Thông tin" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Đánh giá" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>

      </CustomCard>

    </div>
  )
}

export default Detail
