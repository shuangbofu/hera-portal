import axios from "@/utils/request.js";

export function getAllUsers() {
  return axios.get('/userManage/initSso2')
}