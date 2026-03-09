export type ID = Number;

export interface Person {
  ID: Number;
  Name: string;
  Surname: string;

  NickName?: string;
  BirthDate?: string;
  DeathDate?: string;
  BirthPlace?: string;
  DeathPlace?: string;
  Notes?: string;

  Partner?: ID;
  Descendants?: ID[];
}

export interface Family {
  Name: string;
  People: Map<ID, Person>;
}
