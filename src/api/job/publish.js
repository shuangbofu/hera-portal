import axios from "@/utils/request.js";

export function getJobPublishes(jobId, pageSize, pageNum) {
  pageSize = pageSize || 10
  pageNum = pageNum || 1

  return axios.post('/jobPublish/page', {
    pageSize, pageNum, filter: { jobId }
  })
}

export function createJobPublish({ jobId, description, configs, script }) {
  return axios.post('/jobPublish', { jobId, description, configs, script })
}