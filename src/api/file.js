import Http from '@/utils/axios'

export default {
  offer(param) {
    return Http.post(`/api/v1/file/offer`, param)
  },
  answer(param) {
    return Http.post(`/api/v1/file/answer`, param)
  },
  candidate(param) {
    return Http.post(`/api/v1/file/candidate`, param)
  },
  cancel(param) {
    return Http.post(`/api/v1/file/cancel`, param)
  },
  invite(param) {
    return Http.post(`/api/v1/file/invite`, param)
  },
  accept(param) {
    return Http.post(`/api/v1/file/accept`, param)
  },
}
