import Http from '@/utils/axios'

export default {
  offer(param) {
    return Http.post(`/api/v1/video/offer`, param)
  },
  answer(param) {
    return Http.post(`/api/v1/video/answer`, param)
  },
  candidate(param) {
    return Http.post(`/api/v1/video/candidate`, param)
  },
  hangup(param) {
    return Http.post(`/api/v1/video/hangup`, param)
  },
  invite(param) {
    return Http.post(`/api/v1/video/invite`, param)
  },
  accept(param) {
    return Http.post(`/api/v1/video/accept`, param)
  },
}
