import { makeAutoObservable } from "mobx";
import { IUserStore } from "@/store/User/type";

class UserStore implements IUserStore {
  name = ''
  deviceId = ''

  constructor() {
    makeAutoObservable(this)
  }

  setName = (name: string) => {
    this.name = name
  }

  setDeviceId = (deviceId: string) => {
    this.deviceId = deviceId
  }

  fetchUserData = async (deviceId: string) => {
    console.log(deviceId)
    // try {
    //   const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    //   const data = await response.json()
    //   this.setName(data.name)
    // } catch (error) {
    //   console.error('获取用户数据失败', error)
    // }
  }
}

export default UserStore
