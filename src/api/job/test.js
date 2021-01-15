import axios from "@/utils/request.js";
export function forceSetStopped(id) {
  return axios.get(`/job/forceStop?historyId=${id}`)
}

export function getAllUsers() {
  return axios.get('/userManage/initSso')
}