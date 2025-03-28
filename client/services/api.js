import axios from '../utils/axios';

export const fetchCurrentUser = async () => {
    const response = await axios.get('/auth/current');
    return response.data;
};
