import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
let http;

class ActivitiesService {
  constructor() {
    http = axios.create({
      baseURL: API_URL,
    });
  }

  getItems() {
    return http.post(`MyActivity/list`, {});
  }

  createItem({ data }) {
    return http.post(`MyActivity/create`, data);
  }
}

export default new ActivitiesService();
