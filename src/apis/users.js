import { USER_SERVER } from '../config';
import api from './api';
const getCurrentUser = async () => {
  try {
    const response = await api({
      method: 'GET',
      url: `${USER_SERVER}/current-user`,
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { getCurrentUser };
