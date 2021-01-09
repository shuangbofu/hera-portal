import axios from "@/utils/request.js";

export function getJobQueue() {
  return axios.get('/homePage/getJobQueueInfo')
}