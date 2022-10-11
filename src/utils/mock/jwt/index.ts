export const mockJwtService = {
  signAsync: async (payload, { expiresIn }) => {
    switch (expiresIn) {
      case '1h':
        return 'abc'
      case '2h':
        return '123'
    }
  }
}
