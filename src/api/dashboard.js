import axios from "@/utils/request.js";

export function getJobQueue() {
  return axios.get('/homePage/getJobQueueInfo')
}
export function getJobStatus() {
  return axios.get('/homePage/findAllJobStatus')
}

export function getJobRunTimeTop10() {
  return axios.get('/homePage/findJobRunTimeTop10')
}

export function getAllJobStatusDetail() {
  return axios.get('/homePage/findAllJobStatusDetail')
}