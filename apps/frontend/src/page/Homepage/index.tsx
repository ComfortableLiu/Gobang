import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import mainImg from '../../../../frontend/src/assets/bac.png'
import * as style from './style.module.scss';
import { Gamepad, Help, History } from "@icon-park/react";

function Homepage() {

  const navigate = useNavigate()

  const gotoGame = () => {
    navigate('/game')
  }

  const gotoHistory = () => {
    navigate('/history')
  }

  const gotoAbout = () => {
    navigate('/about')
  }

  return (
    <div className={style.main}>
      <img
        src={mainImg}
        alt=""
      />
      <div className={style.buttonList}>
        <Button
          onClick={gotoGame}
          size="large"
          type="primary"
        >
          开始游戏
          <Gamepad
            theme="outline"
            size="18"
            style={{display: 'flex'}}
            fill="#FFF"
          />
        </Button>
        <Button
          onClick={gotoHistory}
          size="large"
          color="purple"
          variant="solid"
        >
          历史记录
          <History
            theme="outline"
            size="18"
            style={{display: 'flex'}}
            fill="#FFF"
          />
        </Button>
        <Button
          onClick={gotoAbout}
          size="large"
          type="default"
        >
          关于游戏
          <Help
            theme="outline"
            size="18"
            style={{display: 'flex'}}
            fill="#333"
            strokeWidth={4}
          />
        </Button>
      </div>
    </div>
  )
}

export default Homepage
