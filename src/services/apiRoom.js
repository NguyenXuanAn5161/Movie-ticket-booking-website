import api from "../utils/axios-custom";

// room
export const callFetchRoomById = async (id) => {
  try {
    const response = await api.get(`/api/room/${id}`);
    return response;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListRoom = async (query) => {
  try {
    const response = await api.get(`/api/room?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateRoom = async (data) => {
  try {
    const response = await api.post("/api/room", data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callUpdateRoom = async (data) => {
  try {
    const response = await api.put(`/api/room/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callDeleteRoom = async (id) => {
  try {
    const response = await api.delete(`/api/room/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
