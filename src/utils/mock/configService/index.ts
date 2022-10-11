export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'abc'
      case 'JWT_REFRESH_SECRET':
        return '123'
      case 'ADMIN_IDENTIFIER':
        return 'admin'
      case 'ADMIN_PASSWORD':
        return 'estrelabet'
    }
  }
}
