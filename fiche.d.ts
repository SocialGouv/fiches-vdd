export interface Fiche {
  id: string;
  children: Children[];
}

export interface Children {
  type: string;
  name: string;
  attributes: Attributes;
  children: Children2[];
}

export interface Attributes {
  "xmlns:dc": string;
  "xmlns:xsi": string;
  ID: string;
  type: string;
  "xsi:noNamespaceSchemaLocation": string;
  dateDerniereModificationImportante: string;
  spUrl: string;
}

export interface Children2 {
  type: string;
  name: string;
  children: Children3[];
  attributes?: Attributes10;
}

export interface Children3 {
  type: string;
  text?: string;
  name?: string;
  attributes?: Attributes2;
  children?: Children4[];
}

export interface Attributes2 {
  ID?: string;
  URL?: string;
  audience?: string;
  type?: string;
}

export interface Children4 {
  type: string;
  text?: string;
  name?: string;
  children?: Children5[];
  attributes?: Attributes9;
}

export interface Children5 {
  type: string;
  text?: string;
  name?: string;
  children?: Children6[];
  attributes?: Attributes8;
}

export interface Children6 {
  type: string;
  text?: string;
  name?: string;
  children?: Children7[];
  attributes?: Attributes7;
}

export interface Children7 {
  type: string;
  name?: string;
  children?: Children8[];
  text?: string;
  attributes?: Attributes6;
}

export interface Children8 {
  type: string;
  text?: string;
  name?: string;
  attributes?: Attributes3;
  children?: Children9[];
}

export interface Attributes3 {
  LienPublication?: string;
  type?: string;
  audience?: string;
  var?: string;
  LienID?: string;
}

export interface Children9 {
  type: string;
  text?: string;
  name?: string;
  children?: Children10[];
  attributes?: Attributes5;
}

export interface Children10 {
  type: string;
  name?: string;
  attributes?: Attributes4;
  children?: Children11[];
  text?: string;
}

export interface Attributes4 {
  URL?: string;
  LienPublication?: string;
  type?: string;
  audience?: string;
  ID?: string;
  var?: string;
}

export interface Children11 {
  type: string;
  text?: string;
  name?: string;
  children?: Children12[];
}

export interface Children12 {
  type: string;
  text?: string;
  name?: string;
  children?: Children13[];
}

export interface Children13 {
  type: string;
  name?: string;
  children?: Children14[];
  text?: string;
}

export interface Children14 {
  type: string;
  text: string;
}

export interface Attributes5 {
  LienPublication?: string;
  type: string;
  audience?: string;
  ID?: string;
  sve?: string;
}

export interface Attributes6 {
  LienID?: string;
  type?: string;
  LienPublication?: string;
  audience?: string;
  var?: string;
  affichage?: string;
}

export interface Attributes7 {
  LienPublication?: string;
  type?: string;
  audience?: string;
  var?: string;
}

export interface Attributes8 {
  LienPublication?: string;
  type?: string;
  audience?: string;
  affichage?: string;
  ID?: string;
  sve?: string;
}

export interface Attributes9 {
  ID: string;
}

export interface Attributes10 {
  ID?: string;
  audience?: string;
  type?: string;
  URL?: string;
  format?: string;
  poids?: string;
  sve?: string;
  important?: string;
}
