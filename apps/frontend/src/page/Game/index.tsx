import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as style from "./style.module.scss";
import { Round } from "@icon-park/react";
import { Piece } from "../../../../frontend/src/page/Game/type";
import { Modal } from "antd";

function Game() {

  const [currentPlayer, setCurrentPlayer] = useState<Piece>(Piece.black)

  // 棋盘数组
  const [board, setBoard] = useState<Piece[][]>(new Array(18).fill(0).map(() => new Array(18).fill(null)))

  // 操作记录
  const [steps, setSteps] = useState<Array<{ row: number, col: number }>>([])

  // 初始化棋局
  const resetChessGame = useCallback(() => {
    setCurrentPlayer(Piece.black)
    setSteps([])
    setBoard(new Array(18).fill(0).map(() => new Array(18).fill(null)))
  }, [])

  useEffect(() => {
    if (steps.length === 324) {
      Modal.success({
        title: '平局',
        content: '平局，请重新开始游戏',
        okText: '重新开始',
        onOk: () => resetChessGame()
      })
    }
  }, [resetChessGame, steps]);

  // 胜利计算标记，true决出胜者，false未决出胜者，null和局
  const checkWin = useCallback((row: number, col: number, targetPiece: Piece) => {
    if (steps.length < 8) return false
    // 18*18=324，下满了，就平局
    if (steps.length === 324) return null
    let i, j, num

    // 判断列
    num = 1
    j = col
    i = row
    while (i-- > 0 && board[i][j] == targetPiece) num++
    i = row
    while (i++ < 17 && board[i][j] == targetPiece) num++
    if (num >= 5) return true

    // 判断行
    num = 1
    i = row
    j = col
    while (j-- > 0 && board[i][j] == targetPiece) num++
    j = col
    while (j++ < 17 && board[i][j] == targetPiece) num++
    if (num >= 5) return true

    // 判断右上左下对角
    num = 1
    i = row
    j = col
    while (j-- > 0 && i++ < 17 && board[i][j] == targetPiece) num++
    i = row
    j = col
    while (j++ < 17 && i-- < 0 && board[i][j] == targetPiece) num++
    if (num >= 5) return true

    // 判断左上右下对角
    num = 1
    i = row
    j = col
    while (j++ < 17 && i++ < 17 && board[i][j] == targetPiece) num++
    i = row
    j = col
    while (j-- > 0 && i-- > 0 && board[i][j] == targetPiece) num++
    return num >= 5
  }, [board, steps])

  // 游戏结束的提示
  const end = useCallback((flag: boolean | null) => {
    if (flag === false) return
    Modal.success({
      title: <div>游戏结束</div>,
      content: `${currentPlayer === Piece.width ? '白子' : '黑子'} 获胜`,
      okText: '重新开始',
      onOk: () => resetChessGame()
    })
  }, [currentPlayer, resetChessGame])

  // 点击棋盘的某个格子
  const handleClick = useCallback((rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex]) return
    setSteps((prev) => [...prev, { row: rowIndex, col: colIndex }])
    setBoard(board.map((row, i) =>
      i === rowIndex ? row.map((col, j) => j === colIndex ? currentPlayer : col) : row
    ))
    setCurrentPlayer(currentPlayer === Piece.black ? Piece.width : Piece.black)
    const flag = checkWin(rowIndex, colIndex, currentPlayer)
    if (flag) end(flag)
  }, [board, checkWin, currentPlayer, end])

  // 渲染棋子
  const piece = useCallback((col: Piece) => {
    if (!col) return null
    if (col === Piece.black) {
      return (
        <Round
          theme="filled"
          size="24"
          fill="#000"
          strokeWidth={2}
          style={{ display: "flex" }}
        />
      )
    }
    return (
      <Round
        theme="two-tone"
        size="24"
        fill={['#000', '#fff']}
        strokeWidth={2}
        style={{ display: "flex" }}
      />
    )
  }, [])

  // 渲染真正起作用的棋盘，18*18的可以落子的点
  const logicBoardView = useMemo(() => {
    return (
      <div className={style.logicBoard}>
        {
          board.map((row, rowIndex) => (
            <div
              className={style.line}
              key={rowIndex}
            >
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={`${style.node} ${col ? style.disable : ''}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {piece(col)}
                </div>
              ))}
            </div>
          ))
        }
      </div>
    )
  }, [board, handleClick, piece])

  // 渲染背景，19*19的棋盘
  const backgroundBoardView = useMemo(() => {
    return (
      <div className={style.backgroundBoard}>
        {new Array(19).fill(0).map((_, rowIndex) => (
          <div
            className={style.line}
            key={rowIndex}
          >
            {new Array(19).fill(0).map((_, colIndex) => (
              <div
                key={colIndex}
                className={style.node}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }, [])

  return (
    <div className={style.main}>
      <h1>对局中</h1>
      <div className={style.playerTitle}>当前玩家：{piece(currentPlayer)}</div>
      <div className={style.checkerboard}>
        {backgroundBoardView}
        {logicBoardView}
      </div>
    </div>
  )
}

export default Game
