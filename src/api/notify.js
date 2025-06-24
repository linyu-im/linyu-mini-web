import Http from '@/utils/axios'

export default {
  getLatestNotify() {
    return Http.get('/api/v1/notify/get')
  },
}
