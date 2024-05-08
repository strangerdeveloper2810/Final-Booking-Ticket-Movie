import _ from "lodash";
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { AppDispatch } from 'Redux/store';
import { GET_TICKET_API } from "../../Redux/constant/BookingTicketConstants"
import { BookingTicketAction } from "../../Redux/reducer/BookingTicket.reducer"
const BookingTicket: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const bookingDetail = useSelector((state) => _.get(state, "Booking.bookingDetail", {}));

    console.log(bookingDetail);

    const { maLichChieu } = useParams();

    React.useEffect(() => {
        dispatch({
            type: GET_TICKET_API,
            payload: maLichChieu
        })

        return () => {
            dispatch(BookingTicketAction.removeDetailBookingTicket())
        }
    }, [maLichChieu, dispatch]);
    return (
        <div>BookingTicket</div>
    )
}

export default BookingTicket