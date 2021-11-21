import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column({ nullable: true })
  productDescription: string;

  @Column({ type: 'decimal' })
  price: number;
}
