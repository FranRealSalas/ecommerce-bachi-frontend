import axiosInstance from "@/lib/axios";
import { UserResponseDTO } from "@/types/user";

const UserService = {
    async createUser(username: string): Promise<UserResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users`, { username })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async login(username: string): Promise<UserResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/login`, { username })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default UserService;