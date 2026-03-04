export type ID = Number;

export interface Person {
  Name: string;
  Surname: string;

  NickName?: string;
  BirthDate?: Date;
  DeathDate?: Date;
  BirthPlace?: string;
  DeathPlace?: string;
  Notes?: string;

  Partners?: ID[];
  Descendants?: ID[];
}

export interface Family {
  Name: string;
  People: Map<ID, Person>;
}
