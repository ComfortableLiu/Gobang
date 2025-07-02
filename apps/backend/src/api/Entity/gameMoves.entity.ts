import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Color } from "./type/gameMoves";

@Entity({
  name: 'game_moves',
})
export class GameMoves extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    name: 'player_id'
  })
  playerId?: number

  @Column({
    name: 'move_number'
  })
  moveNumber?: number

  @Column({
    name: 'match_id'
  })
  matchId?: number

  @Column({
    name: 'x_coordinate'
  })
  xCoordinate?: number

  @Column({
    name: 'y_coordinate'
  })
  yCoordinate?: number

  @Column({
    name: 'move_time'
  })
  moveTime?: Date

  @Column({
    type: 'enum',
    enum: Color,
  })
  color?: Color
}
