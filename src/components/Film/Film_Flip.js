import React from 'react'
import './Flim_Flip.css'
import { history } from "../../App";



export default function Film_Flip(props) {

    const { item } = props;

    return (
        /*
        <div className="wrapper" id='phim'>
            <div className="list__cards">
                <div className="card movie-1 card--watched">
                    <div className='ribbon'>
                        <span>Hot</span>
                    </div>
                    <div className="card__visual">
                        <div className="card__poster">
                            <img src={item.hinhAnh} alt='PhimImg' />
                        </div>
                        <div className="card__visual__action">
                            <button className="button button--danger" onClick={() => {
                                history.push(`detail/${item.maPhim}`);
                            }}>Đặt Vé</button>
                        </div>
                    </div>
                    <div className="card__content mt-5 text-center">
                        <h2 className='text-xl text-black '>{item.tenPhim}</h2>
                        
                    </div>
                </div>
            </div>
        </div>
        */
        <div className="wrapper">
            <div className="card">
                <img src={item.hinhAnh} alt='Phim Img' />
                <div class="badge absolute top-0 left-0 bg-red-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">Hot</div>
                <div class="badge absolute top-0 right-0 bg-gray-700 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded text-center">
                    {item.danhGia}
                    <div className="rating">
                    <i className="fa fa-star " />
                    <i className="fa fa-star " />
                    <i className="fa fa-star " />
                    <i className="fa fa-star " />
                    <i className="fa fa-star " />
                  </div>
                </div>
                <div className="descriptions">
                    <h1>{item.tenPhim}</h1>
                    <p>
                        {item.moTa.length > 400
                            ? item.moTa.substr(0, 350) + "...."
                            : item.moTa}
                    </p>
                    <div className="poster__footer flex flex-row relative pb-10 space-x-4 z-10">
                        <button className="flex items-center py-2 px-4 rounded-full mx-auto text-white bg-green-600 hover:bg-green-800" onClick={() => {
                            history.push(`detail/${item.maPhim}`);
                        }}>
                            Đặt Vé
                        </button>
                    </div>

                </div>
            </div>
        </div>
























    )
}
