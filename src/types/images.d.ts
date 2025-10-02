declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}

// criei esse arquvio pois o o TS reclama porque não sabe o tipo desse módulo.