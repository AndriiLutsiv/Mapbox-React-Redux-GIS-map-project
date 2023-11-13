// export interface Shape { name: string; svg: (color: string) => string; }
export interface Shape { name: string; svg: string; }

export const shapes: Shape[] = [
    {
      name: 'Circle',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`
    },
    {
      name: 'Triangle',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="6,58 32,6, 58,58" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`
    },
    {
      name: 'Pentagon',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="6,26 32,6 58,26 47,54 17,54" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`
    },
    {
      name: 'Square',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="44" height="44" stroke="#ffffff" fill="%COLOR%" strokeWidth="8%" rx="10%" ry="10%" strokeLinejoin="round" /></svg>`
    },
    {
      name: 'Hexagon',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="6,32 17,8 47,8 58,32 47,54 17,54" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`
    },
    {
      name: 'Star',
      svg: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="19,35 6,26 25,20 32,4 39,20 58,26 45,35 49,56 32,44 15,56" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`
    },
  ];