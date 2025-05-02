import { get } from 'lodash'
import { UserLogin, UserRegister } from 'Redux/types/UserType'
import { http } from '../util/setting'

const AuthServices = {
    login: async (values: UserLogin) => {
        try {
            const response = await http.post(`/api/QuanLyNguoiDung/DangNhap`, values)
            if (get(response, 'data.statusCode') === 200) {
                return get(response, 'data.content')
            }

        } catch (error: unknown) {
            return get(error, 'response.data.content')
        }
    },

    register: async (values: UserRegister) => {
        try {
            const response = await http.post(`/api/QuanLyNguoiDung/DangKy`, values);
            if (get(response, 'data.statusCode') === 200) {
                return get(response, 'data.content')
            }
        } catch (error) {
            return get(error, 'response.data.content')
        }
    }
}

export default AuthServices