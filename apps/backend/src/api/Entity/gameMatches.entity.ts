import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ResultReason } from "./type/gameMatches";

@Entity({
  name: 'game_matches',
})
export class GameMatches extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    name: 'player_black_id',
  })
  playerBlackId?: number

  @Column({
    name: 'player_white_id',
  })
  playerWhiteId?: number

  @Column({
    name: 'winner_id',
  })
  winnerId?: number

  @Column({
    name: 'creat_time',
  })
  creatTime?: Date

  @Column({
    name: 'end_time',
  })
  endTime?: Date

  @Column({
    type: 'enum',
    name: 'result_reason',
    enum: ResultReason,
  })
  resultReason?: ResultReason
}
