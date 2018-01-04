import { Reducer } from 'redux';

export class StoreConfig<T> {

  constructor(
    public name: string,
    public reducer: Reducer<T>
  ) { }

  public equals(other: StoreConfig<T>): boolean {
    return (
      this.name === other.name
      &&
      this.reducer.toString() === other.reducer.toString()
    );
  }
}