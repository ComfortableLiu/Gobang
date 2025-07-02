/**
 * 棋局状态
 */
export enum ResultReason {
  // 连五子获胜
  FIVE_WIN = 'five_win',
  // 平局
  DRAW = 'draw',
  // 一方认输
  SURRENDER = 'surrender',
}
