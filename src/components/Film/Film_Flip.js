import React from 'react'
import './Flim_Flip.css'
import { history } from "../../App";
import moment from "moment";


export default function Film_Flip(props) {

    const { item } = props;

    return (

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
                        <h3></h3>
                    </div>
                </div>
            </div>
        </div>
























    )
}
