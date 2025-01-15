import Http from '@/utils/axios'

export default {
  list() {
    return Http.get('/api/v1/user/list')
  },
  listMap() {
    return Http.get('/api/v1/user/list/map')
  },
  onlineWeb() {
    return Http.get('/api/v1/user/online/web')
  },
  update(param) {
    return Http.post('/api/v1/user/update', param)
  },
}
