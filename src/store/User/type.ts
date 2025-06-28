export interface IUserStore {
  name: string
  deviceId: string
  fetchUserData: (deviceId: string) => Promise<void>
}
