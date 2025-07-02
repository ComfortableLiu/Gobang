import { configure } from "mobx";
import React, { createContext, FC, useContext, useRef } from "react";
import UserStore from "../../../frontend/src/store/User/store";

// MobX 最佳实践
configure({ enforceActions: "observed", isolateGlobalState: true })

export interface IRootStore {
  userStore: UserStore
}

// store 实例集合
// 这里放业务store们
class RootStore implements IRootStore {
  userStore = new UserStore()
}

// 创建 React Context
const StoreContext = createContext(null)

// Provider 组件
export const StoreProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<any>(new RootStore())
  return (
    <StoreContext.Provider
      value={storeRef.current}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Hook 获取 store 实例
export const useStores = () => {
  const store = useContext(StoreContext)
  if (!store) throw new Error("useStores 必须在 StoreProvider 内使用")
  return store
}
