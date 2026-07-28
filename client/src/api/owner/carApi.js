import api from "../../api/axios.js"

export const getMyCarsApi = async () => {
  const { data } = await api.post("/car/get-all-car");
  return data;
};

export const addCarApi = async (payload) => {
  const { data } = await api.post("/car/add-car", payload);
  return data;
};

export const updateCarApi = async (id, payload) => {
  const { data } = await api.post(`/car/update-car/${id}`, payload);
  return data;
};

export const deleteCarApi = async (id) => {
  const { data } = await api.post(`/car/remove-car/${id}`);
  return data;
}